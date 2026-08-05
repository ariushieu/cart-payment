package com.hunre.cartpayment.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class PageControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void rendersEveryShoppingAndPaymentPage() throws Exception {
        String[] routes = {
                "/",
                "/cart",
                "/checkout",
                "/payment",
                "/payment/success",
                "/payment/failed"
        };

        for (String route : routes) {
            mockMvc.perform(get(route))
                    .andExpect(status().isOk())
                    .andExpect(content().string(containsString("EduDocs")));
        }

        mockMvc.perform(get("/"))
                .andExpect(content().encoding("UTF-8"))
                .andExpect(content().string(containsString("Tài liệu mới nhất")));
    }
}
