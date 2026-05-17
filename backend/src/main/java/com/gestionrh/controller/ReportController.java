package com.gestionrh.controller;

import com.gestionrh.dto.DashboardResponse;
import com.gestionrh.service.ReportService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/dashboard")
    public DashboardResponse dashboard() {
        return reportService.dashboard();
    }
}
