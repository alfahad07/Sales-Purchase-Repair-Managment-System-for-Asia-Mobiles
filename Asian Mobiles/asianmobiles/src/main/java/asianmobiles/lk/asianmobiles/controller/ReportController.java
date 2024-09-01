package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.Grn_Report;
import asianmobiles.lk.asianmobiles.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
/*@RequestMapping(value = "/bank")*/
public class ReportController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private ReportRepository reportDao;


    @GetMapping(value = "/getgrnbydates/{sDate}/{Edate}", produces = "application/json")
    public List<Grn_Report> getQuotationRequestByPVId (@PathVariable("sDate") String sDate,
                                                 @PathVariable("Edate") String Edate){

       List<Grn_Report>  grn_reportList = new ArrayList<>();
       String [][] grn_reportsstring = reportDao.grnReport(sDate, Edate); //called the service to put to the variable

       for (String[] grnReportrs : grn_reportsstring){ // written an enhanced for loop

           Grn_Report newGrn_report = new Grn_Report(); // creating an new Grn_Report object

           newGrn_report.setGrn_code(grnReportrs[0]);   // setting the values to visible in the html table
           newGrn_report.setSupplier_company_name(grnReportrs[1]);
           newGrn_report.setBill_invoice_number(grnReportrs[2]);
           newGrn_report.setPurchase_order_number(grnReportrs[3]);
           newGrn_report.setNet_total_amount(grnReportrs[4]);
           newGrn_report.setUsername(grnReportrs[5]);

           grn_reportList.add(newGrn_report);

       }

        return grn_reportList;

    }


}
