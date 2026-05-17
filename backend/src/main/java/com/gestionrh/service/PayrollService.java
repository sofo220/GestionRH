package com.gestionrh.service;

import com.gestionrh.dto.PayrollGenerateRequest;
import com.gestionrh.entity.Employee;
import com.gestionrh.entity.Payroll;
import com.gestionrh.exception.ResourceNotFoundException;
import com.gestionrh.repository.EmployeeRepository;
import com.gestionrh.repository.PayrollRepository;
import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.util.List;

@Service
public class PayrollService {
    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;

    public PayrollService(PayrollRepository payrollRepository, EmployeeRepository employeeRepository) {
        this.payrollRepository = payrollRepository;
        this.employeeRepository = employeeRepository;
    }

    public List<Payroll> findAll() {
        return payrollRepository.findAll();
    }

    public Payroll generate(PayrollGenerateRequest request) {
        Employee employee = employeeRepository.findById(request.employeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employe introuvable"));
        BigDecimal net = employee.getSalary().add(request.bonuses()).subtract(request.deductions());
        Payroll payroll = new Payroll();
        payroll.setEmployee(employee);
        payroll.setBaseSalary(employee.getSalary());
        payroll.setBonuses(request.bonuses());
        payroll.setDeductions(request.deductions());
        payroll.setNetSalary(net);
        payroll.setPaymentDate(request.paymentDate());
        return payrollRepository.save(payroll);
    }

    public byte[] exportPdf(Long id) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fiche de paie introuvable"));
        try {
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, output);
            document.open();
            document.add(new Paragraph("Fiche de paie"));
            document.add(new Paragraph("Employe: " + payroll.getEmployee().getFirstName() + " " + payroll.getEmployee().getLastName()));
            document.add(new Paragraph("Salaire de base: " + payroll.getBaseSalary()));
            document.add(new Paragraph("Primes: " + payroll.getBonuses()));
            document.add(new Paragraph("Retenues: " + payroll.getDeductions()));
            document.add(new Paragraph("Salaire net: " + payroll.getNetSalary()));
            document.add(new Paragraph("Date de paiement: " + payroll.getPaymentDate()));
            document.close();
            return output.toByteArray();
        } catch (Exception ex) {
            throw new IllegalArgumentException("Impossible de generer le PDF");
        }
    }
}
