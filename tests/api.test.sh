#!/usr/bin/env bash
# tests/api.test.sh — Wave A verification gate for activity-vault ("The Scout").
# Spec §12, adapted to the §7.6 roster. bash + curl + python3, no other deps.
#
# Local:  CRON_SECRET=test-secret PORT=3000 node tests/serve-local.js &
#         BASE=http://localhost:3000 SECRET=test-secret ./tests/api.test.sh
# Preview: BASE=https://<preview>.vercel.app SECRET=<CRON_SECRET> ./tests/api.test.sh
#
# (This environment's vercel CLI has no `dev` subcommand, so the local run uses
# tests/serve-local.js, which executes the real function files over real HTTP.)
set -euo pipefail
BASE="${BASE:-http://localhost:3000}"
SECRET="${SECRET:-test-secret}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
pass=0; fail=0; skip=0
chk() { # chk <name> <command...>
  local name="$1"; shift
  if "$@" >/dev/null 2>&1; then pass=$((pass+1)); echo "ok   $name";
  else fail=$((fail+1)); echo "FAIL $name"; fi
}
skp() { local name="$1"; shift; skip=$((skip+1)); echo "SKIP $name ($1)"; }

PY_ENVELOPE='
import json,sys,re
e=json.load(sys.stdin)
assert isinstance(e.get("ok"), bool), "ok not bool"
assert "data" in e, "no data"
m=e.get("meta") or {}
assert re.match(r"^[a-z0-9-]+$", m.get("service","")), "bad service"
assert re.match(r"^[0-9]+\.[0-9]+\.[0-9]+$", m.get("version","")), "bad version"
assert re.match(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$", m.get("generated_at","")), "bad generated_at"
assert re.match(r"^req_[0-9a-f]{6}$", m.get("request_id","")), "bad request_id"
if e["ok"]:
    assert "error" not in e, "ok:true must not carry error"
else:
    assert e["error"]["code"] in ["BAD_INPUT","UNAUTHORIZED","NOT_FOUND","RATE_LIMITED","UPSTREAM_UNAVAILABLE","REFRESH_FAILED","INTERNAL"], "bad code"
    assert isinstance(e["error"].get("message"), str) and e["error"]["message"], "empty message"
print("envelope ok")
'

echo "== 1. health =="
chk "health 200" curl -sf "$BASE/api/health"
chk "health envelope ok:true" bash -c "curl -sf '$BASE/api/health' | python3 -c '$PY_ENVELOPE'"
chk "health functions == roster" bash -c "curl -sf '$BASE/api/health' | python3 -c \"
import json,sys; e=json.load(sys.stdin)
assert e['data']['functions']==['health','review-queue','review-decide','cron/scout'], e['data']['functions']
assert e['data']['service']=='vault-scout'
assert e['meta']['service']=='vault-scout'\""
chk "health cache s-maxage=60" bash -c "curl -sD - -o /dev/null '$BASE/api/health' | grep -qi 's-maxage=60'"

echo "== 2. roster envelopes =="
for p in "review-queue" "review-queue?status=all" "review-queue?status=decided"; do
  chk "envelope $p" bash -c "curl -sf '$BASE/api/$p' | python3 -c '$PY_ENVELOPE'"
done
chk "review-queue default pending counts" bash -c "curl -sf '$BASE/api/review-queue' | python3 -c \"
import json,sys; e=json.load(sys.stdin); d=e['data']
assert d['filter']['status']=='pending'
assert d['counts']['pending']==len([c for c in d['candidates'] if c['status']=='pending'])
assert all(set(['id','title','summary','source_url','detected_at','suggested_tags','status']) <= set(c) for c in d['candidates'])\""
chk "review-queue cache s-maxage=600" bash -c "curl -sD - -o /dev/null '$BASE/api/review-queue' | grep -qi 's-maxage=600'"

echo "== 3. envelope schema vs data/v1/schema/envelope.json =="
chk "schema health" bash -c "curl -sf '$BASE/api/health' | python3 '$ROOT/tests/check_envelope.py'"
chk "schema review-queue" bash -c "curl -sf '$BASE/api/review-queue' | python3 '$ROOT/tests/check_envelope.py'"

echo "== 4/5. cron auth gates =="
chk "cron 401 no secret" bash -c "[ \"\$(curl -s -o /dev/null -w '%{http_code}' '$BASE/api/cron/scout')\" = 401 ]"
chk "cron 401 bad secret" bash -c "[ \"\$(curl -s -o /dev/null -w '%{http_code}' -H 'Authorization: Bearer wrong' '$BASE/api/cron/scout')\" = 401 ]"
chk "cron 401 envelope shape" bash -c "curl -s '$BASE/api/cron/scout' | python3 -c '$PY_ENVELOPE'"
chk "cron 401 code UNAUTHORIZED" bash -c "curl -s '$BASE/api/cron/scout' | python3 -c \"
import json,sys; e=json.load(sys.stdin); assert e['ok'] is False and e['error']['code']=='UNAUTHORIZED'\""
chk "review-decide 401 no secret" bash -c "[ \"\$(curl -s -o /dev/null -w '%{http_code}' -X POST -H 'Content-Type: application/json' -d '{\"id\":\"x\",\"decision\":\"approve\"}' '$BASE/api/review-decide')\" = 401 ]"
chk "review-decide 401 bad secret" bash -c "[ \"\$(curl -s -o /dev/null -w '%{http_code}' -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer wrong' -d '{\"id\":\"x\",\"decision\":\"approve\"}' '$BASE/api/review-decide')\" = 401 ]"

echo "== 6. bad input -> 400 =="
chk "bad status 400 BAD_INPUT" bash -c "curl -s '$BASE/api/review-queue?status=bogus' | python3 -c \"
import json,sys; e=json.load(sys.stdin)
assert e['ok'] is False and e['error']['code']=='BAD_INPUT'
assert 'status' in e['error']['details']['fields']\""
chk "decide invalid JSON 400" bash -c "curl -s -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer $SECRET' -d 'not json' '$BASE/api/review-decide' | python3 -c \"
import json,sys; e=json.load(sys.stdin); assert e['ok'] is False and e['error']['code']=='BAD_INPUT'\""
chk "decide missing fields 400 + details.fields" bash -c "curl -s -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer $SECRET' -d '{\"decision\":\"maybe\"}' '$BASE/api/review-decide' | python3 -c \"
import json,sys; e=json.load(sys.stdin)
assert e['ok'] is False and e['error']['code']=='BAD_INPUT'
assert 'id' in e['error']['details']['fields'] and 'decision' in e['error']['details']['fields']\""
chk "decide unknown id 404 NOT_FOUND" bash -c "curl -s -o /dev/null -w '%{http_code}' -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer $SECRET' -d '{\"id\":\"does-not-exist-12345\",\"decision\":\"approve\"}' '$BASE/api/review-decide' | grep -q 404"
chk "decide unknown id envelope" bash -c "curl -s -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer $SECRET' -d '{\"id\":\"does-not-exist-12345\",\"decision\":\"approve\"}' '$BASE/api/review-decide' | python3 -c '$PY_ENVELOPE'"

echo "== 7. static fallback present =="
chk "static review-queue.json" bash -c "curl -sf '$BASE/data/v1/review-queue.json' | python3 -c \"
import json,sys; d=json.load(sys.stdin); assert 'candidates' in d and 'generated_at' in d\""
chk "static decided.json" bash -c "curl -sf '$BASE/data/v1/decided.json' | python3 -c \"
import json,sys; d=json.load(sys.stdin); assert 'decisions' in d and d['retention_days']==90\""
chk "static envelope schema file" curl -sf "$BASE/data/v1/schema/envelope.json"

echo "== 8. vercel.json lint =="
chk "cron daily-or-slower" python3 -c "
import json; v=json.load(open('$ROOT/vercel.json'))
crons=v.get('crons',[])
assert len(crons)==1, crons
c=crons[0]
assert c['path']=='/api/cron/scout', c
f=c['schedule'].split()
assert f[0]!='*' and '*/' not in f[0] and '*/' not in f[1], c
assert c['schedule']=='0 11 * * *', c"
chk "functions: 4 explicit paths, maxDuration 10, no runtime key (vercel rule, 2026-10-12)" python3 -c "
import json; v=json.load(open('$ROOT/vercel.json'))
fns=v['functions']
assert sorted(fns.keys())==['api/cron/scout.js','api/health.js','api/review-decide.js','api/review-queue.js'], fns.keys()
assert all('runtime' not in f for f in fns.values()), 'runtime key must be omitted for Node'
assert all(f.get('maxDuration')==10 for f in fns.values()), 'each function needs >=1 valid property'
assert v['outputDirectory']=='.'
assert v['buildCommand']=='python3 scripts/build.py'
assert v['installCommand']==\"echo 'no dependencies'\""

echo "== 9. cron live run (real feeds, read-only without token) =="
CRON_OUT="$(curl -sf -H "Authorization: Bearer $SECRET" "$BASE/api/cron/scout")"
if echo "$CRON_OUT" | python3 -c "import json,sys; sys.exit(0 if json.load(sys.stdin)['data'].get('duplicate') else 1)" 2>/dev/null; then
  echo "note   a previous suite run is still inside the 60s cooldown; waiting it out once"
  sleep 65
  CRON_OUT="$(curl -sf -H "Authorization: Bearer $SECRET" "$BASE/api/cron/scout")"
fi
echo "$CRON_OUT" | python3 -c "$PY_ENVELOPE" >/dev/null 2>&1 \
  && { pass=$((pass+1)); echo "ok   cron run envelope"; } \
  || { fail=$((fail+1)); echo "FAIL cron run envelope"; }
echo "$CRON_OUT" | python3 -c "
import json,sys
e=json.load(sys.stdin); d=e['data']; m=e['meta']
assert d['checked']==6, d
assert len(m['upstream'])==6, m['upstream']
for u in m['upstream']:
    assert {'source','ok','checked_at'} <= set(u), u
    assert isinstance(u['ok'], bool)
if e['meta']['degraded']:
    assert m['note'], 'degraded without note'
print('cron fields ok')
" >/dev/null 2>&1 \
  && { pass=$((pass+1)); echo "ok   cron fields+upstream honesty"; } \
  || { fail=$((fail+1)); echo "FAIL cron fields+upstream honesty"; }
# duplicate delivery inside 60s -> suppressed, idempotent
chk "cron duplicate suppressed" bash -c "curl -sf -H 'Authorization: Bearer $SECRET' '$BASE/api/cron/scout' | python3 -c \"
import json,sys; e=json.load(sys.stdin); assert e['data'].get('duplicate') is True\""

echo "== 10. review-decide read-only degradation (no github token) =="
# The read-only path needs a real pending candidate. The live scan usually finds
# none (the VM pipeline's seen.json is current), so the test installs one
# synthetic TEST-ONLY candidate, runs the probe, then restores the file
# byte-identical. The candidate is never committed and never served.
RQ="$ROOT/pipeline/review-queue.json"
RQ_BAK="$RQ.test-bak"
cp "$RQ" "$RQ_BAK"
trap 'cp "$RQ_BAK" "$RQ"; rm -f "$RQ_BAK"' EXIT
python3 - "$RQ" <<'EOF'
import json, sys
p = sys.argv[1]
q = json.load(open(p))
assert not any(c["id"] == "test-503-probe" for c in q), "stale probe candidate present"
q.append({
    "id": "test-503-probe",
    "status": "pending",
    "feed": "TEST FIXTURE",
    "title": "TEST PROBE — synthetic candidate for the read-only test (not a real activity idea)",
    "link": "https://example.invalid/test-503-probe",
    "published": "Sun, 11 Oct 2026 23:00:00 +0000",
    "summary": "Fixture only.",
    "note": "TEST FIXTURE — remove after test.",
})
json.dump(q, open(p, "w"), indent=2, ensure_ascii=False)
print("fixture installed")
EOF
DECIDE_OUT="$(curl -s -w '\n%{http_code}' -X POST -H 'Content-Type: application/json' -H "Authorization: Bearer $SECRET" -d '{"id":"test-503-probe","decision":"reject","note":"test probe"}' "$BASE/api/review-decide")"
DECIDE_CODE="$(echo "$DECIDE_OUT" | tail -1)"
DECIDE_BODY="$(echo "$DECIDE_OUT" | head -n -1)"
if [ "$DECIDE_CODE" = 500 ]; then pass=$((pass+1)); echo "ok   decide read-only 500 REFRESH_FAILED"; else fail=$((fail+1)); echo "FAIL decide read-only 500 (got $DECIDE_CODE)"; fi
echo "$DECIDE_BODY" | python3 -c "
import json,sys
e=json.load(sys.stdin)
assert e['ok'] is False and e['error']['code']=='REFRESH_FAILED'
assert 'GITHUB_REPO_TOKEN' in e['error']['message']
assert e['error']['details']['committed'] is False
assert e['error']['details']['decision']=='reject'
print('read-only message ok')
" >/dev/null 2>&1 \
  && { pass=$((pass+1)); echo "ok   decide read-only honest message"; } \
  || { fail=$((fail+1)); echo "FAIL decide read-only honest message"; }
# restore the pipeline file byte-identical and verify
cp "$RQ_BAK" "$RQ"; rm -f "$RQ_BAK"
trap - EXIT
python3 -c "
import json
q=json.load(open('$RQ'))
assert not any(c['id']=='test-503-probe' for c in q), 'probe candidate leaked into pipeline file'
print('fixture removed, pipeline file clean')
" >/dev/null 2>&1 \
  && { pass=$((pass+1)); echo "ok   fixture cleaned up"; } \
  || { fail=$((fail+1)); echo "FAIL fixture cleaned up"; }

echo
echo "pass=$pass fail=$fail skip=$skip"
[ "$fail" = 0 ]
