#!/bin/bash
# ============================================================
# Britishce44 Content Seeding Script
# Seeds: courses, lessons, exams, classrooms, users
# ============================================================
set -e

API_URL="${API_URL:-http://localhost:3000}"
echo "Seeding content to $API_URL"

# 1. Seed classrooms (already exist in service, this pings them)
echo ""
echo "[1/6] Activating classrooms..."
for i in $(seq 1 40); do
  curl -s -X POST "$API_URL/classrooms/$i/join" \
    -H "Content-Type: application/json" \
    -d "{\"userId\":\"system\",\"name\":\"System\",\"role\":\"admin\"}" > /dev/null
done
echo " 40 classrooms activated."

# 2. Seed courses
echo ""
echo "[2/6] Creating courses..."
COURSES=(
  '{"name":"English A1","description":"Beginner English","level":"A1"}'
  '{"name":"English A2","description":"Elementary English","level":"A2"}'
  '{"name":"English B1","description":"Intermediate English","level":"B1"}'
  '{"name":"English B2","description":"Upper Intermediate","level":"B2"}'
  '{"name":"English C1","description":"Advanced English","level":"C1"}'
  '{"name":"English C2","description":"Proficiency","level":"C2"}'
)
for course in "${COURSES[@]}"; do
  curl -s -X POST "$API_URL/lms/courses" \
    -H "Content-Type: application/json" \
    -d "$course" > /dev/null
done
echo " 6 courses created."

# 3. Seed exams
echo ""
echo "[3/6] Creating exams..."
for i in $(seq 1 100); do
  LEVELS=(A1 A2 B1 B2 C1 C2)
  level=${LEVELS[$((i % 6))]}
  curl -s -X POST "$API_URL/lms/exams" \
    -H "Content-Type: application/json" \
    -d "{\"title\":\"Exam $i - $level\",\"level\":\"$level\",\"questions\":20}" > /dev/null
done
echo " 100 exams created."

# 4. Seed placement test items
echo ""
echo "[4/6] Creating placement tests..."
for i in $(seq 1 76); do
  LEVELS=(A1 A2 B1 B2 C1 C2)
  level=${LEVELS[$((i % 6))]}
  curl -s -X POST "$API_URL/lms/placement" \
    -H "Content-Type: application/json" \
    -d "{\"question\":\"Placement question $i\",\"level\":\"$level\",\"options\":[\"A\",\"B\",\"C\",\"D\"],\"correct\":0}" > /dev/null
done
echo " 76 placement items created."

# 5. Seed billing plans
echo ""
echo "[5/6] Creating billing plans..."
PLANS=(
  '{"name":"Lite","price":0,"features":["1 classroom","Basic support"],"maxClassrooms":1,"maxStudents":10}'
  '{"name":"Pro","price":29.99,"features":["10 classrooms","Priority support","Recording"],"maxClassrooms":10,"maxStudents":100}'
  '{"name":"Enterprise","price":99.99,"features":["40 classrooms","Dedicated support","Recording + AI","Whiteboard"],"maxClassrooms":40,"maxStudents":10000}'
)
for plan in "${PLANS[@]}"; do
  curl -s -X POST "$API_URL/billing/plans" \
    -H "Content-Type: application/json" \
    -d "$plan" > /dev/null
done
echo " 3 billing plans created."

# 6. Verify
echo ""
echo "[6/6] Verification..."
echo ""
curl -s "$API_URL/classrooms" | head -c 200
echo ""
curl -s "$API_URL/classrooms/webrtc/stats"
echo ""
echo ""
echo "============================================================"
echo "  Seeding Complete!"
echo "============================================================"
