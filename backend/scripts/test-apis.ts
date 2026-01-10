const API_URL = "http://localhost:5000/api"
let authToken = ""

interface TestResult {
  endpoint: string
  method: string
  status: string
  statusCode?: number
  error?: string
}

const results: TestResult[] = []

async function test(method: string, endpoint: string, body?: any): Promise<boolean> {
  try {
    console.log(`\n[TEST] ${method} ${endpoint}`)

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
    }

    const response = await fetch(`${API_URL}${endpoint}`, options)
    const data: any = await response.json()

    if (response.ok || response.status === 201) {
      console.log(`✓ Success (${response.status})`)
      results.push({ endpoint, method, status: "PASS", statusCode: response.status })

      // Store token if login was successful
      if (endpoint === "/auth/signin" && data?.token) {
        authToken = data.token
        console.log("✓ Token stored for authenticated requests")
      }

      return true
    } else {
      console.log(`✗ Failed (${response.status})`)
      results.push({ endpoint, method, status: "FAIL", statusCode: response.status, error: data?.message })
      return false
    }
  } catch (err: any) {
    console.log(`✗ Error: ${err.message}`)
    results.push({ endpoint, method, status: "ERROR", error: err.message })
    return false
  }
}

async function runTests() {
  console.log("========================================")
  console.log("  CYBER DRILL API TEST SUITE")
  console.log("========================================")

  // 1. Authentication Tests
  console.log("\n\n📌 AUTHENTICATION TESTS")
  console.log("=====================================")

  await test("POST", "/auth/signin", {
    email: "admin@cyberdrill.com",
    password: "Admin@2024",
  })

  // 2. Questions Tests
  console.log("\n\n📌 QUESTIONS TESTS")
  console.log("=====================================")

  await test("GET", "/questions")

  await test("POST", "/questions", {
    text: "Test Question?",
    category: "Security",
    difficulty: "easy",
    timeLimit: 180,
  })

  // 3. Leaders Tests
  console.log("\n\n📌 LEADERS TESTS")
  console.log("=====================================")

  await test("GET", "/leaders")

  await test("POST", "/leaders", {
    email: "leader@test.com",
    password: "Leader@123",
    name: "Test Leader",
    team: "Team A",
  })

  // 4. X-CONs Tests
  console.log("\n\n📌 X-CONs TESTS")
  console.log("=====================================")

  await test("GET", "/xcons")

  await test("POST", "/xcons", {
    email: "xcon@test.com",
    password: "XCon@123",
    name: "Test X-CON",
  })

  // 5. Sessions Tests
  console.log("\n\n📌 SESSIONS TESTS")
  console.log("=====================================")

  await test("GET", "/sessions")

  await test("POST", "/sessions", {
    name: "Test Session",
    status: "active",
  })

  // 6. Answers Tests
  console.log("\n\n📌 ANSWERS TESTS")
  console.log("=====================================")

  await test("GET", "/answers")

  await test("POST", "/answers", {
    leaderId: "1",
    questionId: "1",
    answer: "Test answer",
  })

  // 7. Leaderboard Tests
  console.log("\n\n📌 LEADERBOARD TESTS")
  console.log("=====================================")

  await test("GET", "/leaderboard")

  // Print Summary
  console.log("\n\n========================================")
  console.log("  TEST SUMMARY")
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
    console.log(`${icon} ${r.method} ${r.endpoint} - ${r.status} ${r.statusCode ? `(${r.statusCode})` : ""}`)
    if (r.error) {
      console.log(`  Error: ${r.error}`)
    }
  })

  console.log("\n========================================\n")
}

// Run tests
runTests().catch(console.error)
