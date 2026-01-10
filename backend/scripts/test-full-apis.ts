const API_URL = "http://localhost:5000/api"
let authToken = ""
let testQuestionId = ""
let testLeaderId = ""
let testXconId = ""
let testSessionId = ""
let testAnswerId = ""

interface TestResult {
  endpoint: string
  method: string
  operation: string
  status: string
  statusCode?: number
  error?: string
  response?: any
}

const results: TestResult[] = []

async function test(
  method: string,
  endpoint: string,
  operation: string,
  body?: any,
): Promise<{ success: boolean; data?: any }> {
  try {
    console.log(`\n[${method}] ${endpoint}`)
    console.log(`Operation: ${operation}`)

    const options: any = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    }

    if (authToken) {
      options.headers["Authorization"] = `Bearer ${authToken}`
    }

    if (body) {
      options.body = JSON.stringify(body)
      console.log(`Data:`, JSON.stringify(body, null, 2))
    }

    const response = await fetch(`${API_URL}${endpoint}`, options)
    const data: any = await response.json()

    if (response.ok || response.status === 201) {
      console.log(`✓ SUCCESS (${response.status})`)
      console.log(`Response:`, JSON.stringify(data, null, 2))
      results.push({
        endpoint,
        method,
        operation,
        status: "PASS",
        statusCode: response.status,
        response: data,
      })

      if (endpoint === "/auth/signin" && data?.token) {
        authToken = data.token
        console.log("✓ Token stored for authenticated requests")
      }

      return { success: true, data }
    } else {
      console.log(`✗ FAILED (${response.status})`)
      console.log(`Error:`, JSON.stringify(data, null, 2))
      results.push({
        endpoint,
        method,
        operation,
        status: "FAIL",
        statusCode: response.status,
        error: data?.message || "Unknown error",
      })
      return { success: false }
    }
  } catch (err: any) {
    console.log(`✗ ERROR: ${err.message}`)
    results.push({
      endpoint,
      method,
      operation,
      status: "ERROR",
      error: err.message,
    })
    return { success: false }
  }
}

async function runFullTests() {
  console.log("========================================")
  console.log("  CYBER DRILL - FULL API TEST SUITE")
  console.log("  Testing: CREATE, READ, UPDATE, DELETE")
  console.log("========================================")

  // 1. AUTHENTICATION
  console.log("\n\n🔐 AUTHENTICATION TESTS")
  console.log("=====================================")

  const loginResult = await test("POST", "/auth/signin", "Admin Login", {
    email: "admin@cyberdrill.com",
    password: "Admin@2024",
  })

  if (!loginResult.success) {
    console.log("\n✗ Authentication failed! Cannot continue tests.")
    return
  }

  // 2. QUESTIONS TESTS - CREATE, READ, UPDATE, DELETE
  console.log("\n\n📝 QUESTIONS TESTS (CRUD)")
  console.log("=====================================")

  // CREATE
  const createQResult = await test("POST", "/questions", "Create Question", {
    text: "What is the first step in network security?",
    category: "Network",
    difficulty: "easy",
    timeLimit: 120,
  })
  if (createQResult.data?.data?.id) {
    testQuestionId = createQResult.data.data.id
  }

  // READ ALL
  await test("GET", "/questions", "Get All Questions")

  // READ SINGLE
  if (testQuestionId) {
    await test("GET", `/questions/${testQuestionId}`, "Get Single Question")
  }

  // UPDATE
  if (testQuestionId) {
    await test("PATCH", `/questions/${testQuestionId}`, "Update Question", {
      text: "What is the UPDATED first step in network security?",
      difficulty: "medium",
      timeLimit: 180,
    })
  }

  // 3. LEADERS TESTS - CREATE, READ, UPDATE, DELETE
  console.log("\n\n👤 LEADERS TESTS (CRUD)")
  console.log("=====================================")

  // CREATE
  const createLResult = await test("POST", "/leaders", "Create Leader", {
    email: "john.leader@cyberdrill.com",
    password: "Leader@2024",
    name: "John Leader",
    team: "Security Team A",
  })
  if (createLResult.data?.data?.id) {
    testLeaderId = createLResult.data.data.id
  }

  // READ ALL
  await test("GET", "/leaders", "Get All Leaders")

  // READ SINGLE
  if (testLeaderId) {
    await test("GET", `/leaders/${testLeaderId}`, "Get Single Leader")
  }

  // UPDATE
  if (testLeaderId) {
    await test("PATCH", `/leaders/${testLeaderId}`, "Update Leader", {
      name: "John Leader Updated",
      team: "Security Team B",
    })
  }

  // 4. X-CONs TESTS - CREATE, READ, UPDATE, DELETE
  console.log("\n\n👨‍💼 X-CONs TESTS (CRUD)")
  console.log("=====================================")

  // CREATE
  const createXResult = await test("POST", "/xcons", "Create X-CON", {
    email: "alice.xcon@cyberdrill.com",
    password: "XCon@2024",
    name: "Alice X-CON",
  })
  if (createXResult.data?.data?.id) {
    testXconId = createXResult.data.data.id
  }

  // READ ALL
  await test("GET", "/xcons", "Get All X-CONs")

  // READ SINGLE
  if (testXconId) {
    await test("GET", `/xcons/${testXconId}`, "Get Single X-CON")
  }

  // UPDATE
  if (testXconId) {
    await test("PATCH", `/xcons/${testXconId}`, "Update X-CON", {
      name: "Alice X-CON Updated",
    })
  }

  // 5. SESSIONS TESTS - CREATE, READ, UPDATE
  console.log("\n\n🎯 SESSIONS TESTS (CRUD)")
  console.log("=====================================")

  // CREATE
  const createSResult = await test("POST", "/sessions", "Create Session", {
    name: "Security Drill 2024",
    status: "active",
  })
  if (createSResult.data?.data?.id) {
    testSessionId = createSResult.data.data.id
  }

  // READ ALL
  await test("GET", "/sessions", "Get All Sessions")

  // READ SINGLE
  if (testSessionId) {
    await test("GET", `/sessions/${testSessionId}`, "Get Single Session")
  }

  // UPDATE
  if (testSessionId) {
    await test("PATCH", `/sessions/${testSessionId}`, "Update Session", {
      status: "paused",
    })
  }

  // 6. ANSWERS TESTS - CREATE, READ, UPDATE
  console.log("\n\n💬 ANSWERS TESTS (CRUD)")
  console.log("=====================================")

  if (testLeaderId && testQuestionId) {
    // CREATE
    const createAResult = await test("POST", "/answers", "Submit Answer", {
      leaderId: testLeaderId,
      questionId: testQuestionId,
      answer: "Implement a firewall to block unauthorized access",
    })
    if (createAResult.data?.data?.id) {
      testAnswerId = createAResult.data.data.id
    }

    // READ ALL
    await test("GET", "/answers", "Get All Answers")

    // READ SINGLE
    if (testAnswerId) {
      await test("GET", `/answers/${testAnswerId}`, "Get Single Answer")
    }

    // APPROVE ANSWER
    if (testAnswerId) {
      await test("POST", `/answers/${testAnswerId}/approve`, "Approve Answer", {
        feedback: "Great answer! Correct understanding of network security.",
      })
    }
  }

  // 7. LEADERBOARD TEST
  console.log("\n\n🏆 LEADERBOARD TEST")
  console.log("=====================================")

  await test("GET", "/leaderboard", "Get Leaderboard Rankings")

  // 8. DELETE TESTS
  console.log("\n\n🗑️  DELETE TESTS (Cleanup)")
  console.log("=====================================")

  if (testAnswerId) {
    await test("DELETE", `/answers/${testAnswerId}`, "Delete Answer")
  }

  if (testSessionId) {
    await test("DELETE", `/sessions/${testSessionId}`, "Delete Session")
  }

  if (testXconId) {
    await test("DELETE", `/xcons/${testXconId}`, "Delete X-CON")
  }

  if (testLeaderId) {
    await test("DELETE", `/leaders/${testLeaderId}`, "Delete Leader")
  }

  if (testQuestionId) {
    await test("DELETE", `/questions/${testQuestionId}`, "Delete Question")
  }

  // PRINT SUMMARY
  console.log("\n\n========================================")
  console.log("  📊 TEST SUMMARY REPORT")
  console.log("========================================\n")

  const passed = results.filter((r) => r.status === "PASS").length
  const failed = results.filter((r) => r.status === "FAIL").length
  const errors = results.filter((r) => r.status === "ERROR").length
  const total = results.length

  console.log(`Total Tests: ${total}`)
  console.log(`✓ Passed: ${passed}`)
  console.log(`✗ Failed: ${failed}`)
  console.log(`⚠ Errors: ${errors}`)
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(2)}%\n`)

  console.log("Detailed Results:")
  console.log("=====================================")
  results.forEach((r) => {
    const icon = r.status === "PASS" ? "✓" : r.status === "FAIL" ? "✗" : "⚠"
    console.log(`${icon} [${r.method}] ${r.endpoint}`)
    console.log(`  Operation: ${r.operation}`)
    console.log(`  Status: ${r.status} ${r.statusCode ? `(${r.statusCode})` : ""}`)
    if (r.error) {
      console.log(`  Error: ${r.error}`)
    }
  })

  console.log("\n========================================\n")

  // Group by operation type
  console.log("Results by Operation Type:")
  console.log("=====================================")
  const createOps = results.filter((r) => r.operation.includes("Create"))
  const readOps = results.filter((r) => r.operation.includes("Get"))
  const updateOps = results.filter((r) => r.operation.includes("Update"))
  const deleteOps = results.filter((r) => r.operation.includes("Delete"))

  console.log(`📝 CREATE: ${createOps.filter((r) => r.status === "PASS").length}/${createOps.length} passed`)
  console.log(`📖 READ: ${readOps.filter((r) => r.status === "PASS").length}/${readOps.length} passed`)
  console.log(`✏️  UPDATE: ${updateOps.filter((r) => r.status === "PASS").length}/${updateOps.length} passed`)
  console.log(`🗑️  DELETE: ${deleteOps.filter((r) => r.status === "PASS").length}/${deleteOps.length} passed`)

  console.log("\n========================================\n")
}

// Run tests
runFullTests().catch(console.error)
