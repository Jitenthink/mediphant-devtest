package com.base.mediphantdevtest.data.repository

import com.base.mediphantdevtest.data.api.MediphantApiService
import com.base.mediphantdevtest.data.models.FAQResponse
import com.base.mediphantdevtest.data.models.FAQMatch
import com.base.mediphantdevtest.data.models.InteractionResponse
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.test.runTest
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test

class MediphantRepositoryTest {
    
    private lateinit var repository: MediphantRepository
    private lateinit var mockApiService: MediphantApiService
    
    @Before
    fun setup() {
        mockApiService = mockk()
        repository = MediphantRepository()
        // Note: In a real test, we would need to inject the mock service
        // For now, this is a placeholder test structure
    }
    
    @Test
    fun `checkInteraction should return success result when API call succeeds`() = runTest {
        // Given
        val medA = "Warfarin"
        val medB = "Ibuprofen"
        val expectedResponse = InteractionResponse(
            pair = listOf(medA, medB),
            isPotentiallyRisky = true,
            reason = "increased bleeding risk",
            advice = "avoid combo; consult clinician"
        )
        
        // When
        val result = repository.checkInteraction(medA, medB)
        
        // Then
        assertTrue(result.isSuccess)
        assertEquals(expectedResponse.pair, result.getOrNull()?.pair)
        assertEquals(expectedResponse.isPotentiallyRisky, result.getOrNull()?.isPotentiallyRisky)
    }
    
    @Test
    fun `searchFAQ should return success result when API call succeeds`() = runTest {
        // Given
        val query = "medication adherence"
        val expectedResponse = FAQResponse(
            answer = "Based on the available information: Medication adherence improves outcomes...",
            matches = listOf(
                FAQMatch(
                    text = "Medication adherence improves outcomes in diabetes",
                    score = 0.9,
                    title = "Medication Adherence"
                )
            )
        )
        
        // When
        val result = repository.searchFAQ(query)
        
        // Then
        assertTrue(result.isSuccess)
        assertNotNull(result.getOrNull()?.answer)
        assertTrue(result.getOrNull()?.matches?.isNotEmpty() == true)
    }
}
