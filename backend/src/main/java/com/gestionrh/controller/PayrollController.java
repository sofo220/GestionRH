package com.gestionrh.controller;

import com.gestionrh.dto.PayrollGenerateRequest;
import com.gestionrh.entity.Payroll;
import com.gestionrh.service.PayrollService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/payrolls")
public class PayrollController {
    private final PayrollService payrollService;

    public PayrollController(PayrollService payrollService) {
        this.payrollService = payrollService;
    }

    @GetMapping
    public List<Payroll> all() {
        return payrollService.findAll();
    }

    @PostMapping("/generate")
    @PreAuthorize("hasAnyRole('ADMIN','RH')")
    public Payroll generate(@Valid @RequestBody PayrollGenerateRequest request) {
        return payrollService.generate(request);
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> pdf(@PathVariable Long id) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=fiche-paie-" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(payrollService.exportPdf(id));
    }
}
