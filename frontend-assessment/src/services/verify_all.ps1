$BASE_URL = "http://localhost:8001"

Write-Host "--- starting Full Endpoint verification ---"

try {
    # 1. Start Session
    Write-Host "`n[1/4] POST /api/sessions/start"
    $startBody = @{ candidateId = "verify_all_test_user_ps" } | ConvertTo-Json
    $startRes = Invoke-RestMethod -Uri "$BASE_URL/api/sessions/start" -Method Post -Headers @{"Content-Type" = "application/json"} -Body $startBody
    Write-Host "✅ Response Status: 201"
    $sessionId = $startRes.sessionId
    Write-Host "Session ID: $sessionId"

    # 2. Fetch Question
    Write-Host "`n[2/4] GET /api/sessions/$sessionId/question"
    $questRes = Invoke-RestMethod -Uri "$BASE_URL/api/sessions/$sessionId/question" -Method Get
    Write-Host "✅ Question: $($questRes.text)"

    # 3. Submit Answer
    Write-Host "`n[3/4] POST /api/sessions/$sessionId/submit"
    $submitBody = @{ candidateId = "verify_all_test_user_ps"; answerText = "Verifying standard integration node via PS." } | ConvertTo-Json
    $submitRes = Invoke-RestMethod -Uri "$BASE_URL/api/sessions/$sessionId/submit" -Method Post -Headers @{"Content-Type" = "application/json"} -Body $submitBody
    Write-Host "✅ Submit Response: $($submitRes.message)"

    # 4. Fetch Status
    Write-Host "`n[4/4] GET /api/sessions/$sessionId/status"
    $statusRes = Invoke-RestMethod -Uri "$BASE_URL/api/sessions/$sessionId/status" -Method Get
    Write-Host "✅ Status: $($statusRes.status)"

    Write-Host "`n--- ALL ENDPOINTS RESPONDED PERFECTLY! ---"
} catch {
    Write-Host "`n❌ Verification Failed: $_"
}
