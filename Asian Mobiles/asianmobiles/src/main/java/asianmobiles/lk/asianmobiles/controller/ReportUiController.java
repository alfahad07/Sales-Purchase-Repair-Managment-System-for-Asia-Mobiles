package asianmobiles.lk.asianmobiles.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
/*@RequestMapping(value = "/reports")*/
public class ReportUiController {

    @GetMapping(value = "/grnReports")
    //creating a function to display the UI.
    public ModelAndView grnUi() {

        // create ModelAndView object called employeeui
        ModelAndView grnui = new ModelAndView();

        //set employee.js.html
        grnui.setViewName("GRN_Report.html");

        return grnui;
    }


}
