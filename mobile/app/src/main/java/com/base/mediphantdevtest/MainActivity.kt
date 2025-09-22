package com.base.mediphantdevtest

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.base.mediphantdevtest.ui.theme.MediphantDevTestTheme
import kotlinx.coroutines.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import io.ktor.client.*
import io.ktor.client.engine.android.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.client.call.*
import io.ktor.serialization.kotlinx.json.*

@Serializable
data class FAQResponse(
    val answer: String,
    val matches: List<Match>
)

@Serializable
data class Match(
    val text: String,
    val score: Double
)

@Composable
fun FAQView() {
    var query by remember { mutableStateOf("") }
    var result by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }

    val sampleQuestions = listOf(
        "How can I improve medication adherence?",
        "What are high-risk drug interactions?",
        "How should I manage my medication list?",
        "What tools can help with taking medications?"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        TextField(
            value = query,
            onValueChange = { query = it },
            label = { Text("Enter your question") },
            modifier = Modifier.fillMaxWidth()
        )

        Text(
            text = "Try these sample questions:",
            style = MaterialTheme.typography.titleSmall,
            modifier = Modifier.padding(vertical = 4.dp)
        )

        sampleQuestions.forEach { question ->
            Text(
                text = question,
                color = MaterialTheme.colorScheme.primary,
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { 
                        query = question
                    }
                    .padding(vertical = 2.dp)
            )
        }

        Button(
            onClick = {
                isLoading = true
                result = ""
                // Call API in coroutine
                CoroutineScope(Dispatchers.Main).launch {
                    try {
                        val response = fetchFAQ(query)
                        result = response
                    } catch (e: Exception) {
                        result = "Error: ${e.message}"
                    } finally {
                        isLoading = false
                    }
                }
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Get Answer")
        }

        if (isLoading) {
            Text("Loading...")
        } else {
            Text(
                text = result,
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}

val httpClient = HttpClient(Android) {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
            ignoreUnknownKeys = true
        })
    }
}

suspend fun fetchFAQ(query: String): String = withContext(Dispatchers.IO) {
    try {
        val faqResponse = httpClient.get("http://192.168.1.30:3000/api/faq") {
            parameter("q", query)
        }.body<FAQResponse>()
        
        "Answer: ${faqResponse.answer}\n\nMatches: ${faqResponse.matches.joinToString("\n") { match: Match -> "- ${match.text} (${match.score})" }}"
    } catch (e: Exception) {
        "Error: ${e.message}"
    }
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MediphantDevTestTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    FAQView()
                }
            }
        }
    }
}