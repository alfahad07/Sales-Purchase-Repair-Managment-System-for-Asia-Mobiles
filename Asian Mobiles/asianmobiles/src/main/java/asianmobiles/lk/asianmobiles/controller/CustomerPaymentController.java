package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.*;
import asianmobiles.lk.asianmobiles.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/customerpayment")
public class CustomerPaymentController {


    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private PrivilegeController privilegeController;

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private CustomerPaymentRepository customerPaymentDao;

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private SalesInvoiceRepository salesInvoiceDao;

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private SalesInvoiceStatusRepository salesInvoiceStatusDao;
    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private PaymentStatusRepository paymentStatusDao;
    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private UserRepository userDao;

    // to take each supplier payment object for update and to view btn
    @GetMapping(value = "/getbyid/{id}", produces = "application/json")
    public CustomerPayment getCustomerPaymentByPVId(@PathVariable("id") int id) {

        return customerPaymentDao.getReferenceById(id);

    }

    // creating getMapping annotation to get the UserManagement UI.
    @GetMapping
    //creating a function to display the UserManagement UI.
    public ModelAndView customerPaymentUi() {

        // create ModelAndView object called userui
        ModelAndView customerPaymentui = new ModelAndView();

        //set SupplierPayment_Management.html
        customerPaymentui.setViewName("CustomerPayment_Management.html");

        return customerPaymentui;


    }

    //Create get mapping to take all the user data from the database to display on the browser as JSON OBJECT--->[/user]
    @GetMapping(value = "/findall", produces = "application/json")
    //attribute "produces" used to take the data as which type to display on the browser, "application/json" is used to take the data as JSON OBJECT.
    private List<CustomerPayment> findAll() {

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...
        //Checking the logged user is existing in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilage(authentication.getName(), "SALES-PAYMENT");

        if (loggedUserPrivilege != null && loggedUserPrivilege.get("sel")) {

            return customerPaymentDao.findAll(Sort.by(Sort.Direction.DESC, "id"));

        } else {

            List<CustomerPayment> customerPaymentList = new ArrayList<>();
            return customerPaymentList;

        }

    }


    //to get all the supplier needed details
    @GetMapping(value = "/list", produces = "application/json")
    public List<CustomerPayment> supplierPaymentList () {

        return customerPaymentDao.list();

    }


    //Create delete mapping to delete SupplierPayment by using DeleteMapping Annotation
    @DeleteMapping
    public String deleteCustomerPayment(@RequestBody CustomerPayment customerPayment) {

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "SALES-PAYMENT");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("del")) {


            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE
            //checking function to check wether the employee.js exist in the database
            CustomerPayment existCustomerPayment = customerPaymentDao.getReferenceById(customerPayment.getId());

            // Creating a function to delete the employee.js from the database after checking the employee.js's existance.
            if (existCustomerPayment != null) {
                try {

                    //set auto insert Values
                    existCustomerPayment.setDeleted_datetime(LocalDateTime.now()); // Setting the delete time of the employee.js
                    existCustomerPayment.setPayment_status_id(paymentStatusDao.getReferenceById(3)); // Setting employeeStatus to deleted once the delete is done
                    existCustomerPayment.setDeleted_user_id(loggedUser);

                    customerPaymentDao.save(existCustomerPayment);

                    return "0";


                } catch (Exception ex) {

                    return "Delete not completed : " + ex.getMessage();

                }
            } else {

                return "Delete Not Completed : Customer Payment Not Available";

            }


        } else {

            return "Customer Payment Delete not completed : You don't have access";

        }

    }


    //CREATE POST MAPPING FUNCTION TO ADD SUPPLIER PAYMENT [/supplierpayment - POST]
    @PostMapping
    public String addSupplierPayment(@RequestBody CustomerPayment customerPayment) {

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is existing in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "SALES-PAYMENT");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("ins")) {


            try {

                //SET AUTO INSERT VALUE
                customerPayment.setAdded_datetime(LocalDateTime.now());
                customerPayment.setAdded_user_id(loggedUser);

                //SUPPLIER PAYMENT BILL NO AUTO GENERATE
                String lastCustomerPaymentBillNo = customerPaymentDao.getLastCustomerPaymentBillNo();
                String nextCustomerPaymentBillNo = "";

                if (lastCustomerPaymentBillNo != null){

                    nextCustomerPaymentBillNo = "CP" + String.format("%08d" ,Integer.valueOf(lastCustomerPaymentBillNo.substring(2)) + 1);

                }else {

                    nextCustomerPaymentBillNo = "CP00000001";

                }

                customerPayment.setBill_number(nextCustomerPaymentBillNo); // setiing the generated Customer_Payment bill no


                //SAVE THE CHANGES
                CustomerPayment newCustomerPayment = customerPaymentDao.save(customerPayment);

                //Need to change the Sales_Invoice_Number Status to received
                SalesInvoice salesInvoice = salesInvoiceDao.getReferenceById(newCustomerPayment.getSales_invoice_id().getId());
                salesInvoice.setSales_invoice_status_id(salesInvoiceStatusDao.getReferenceById(1));

                //THE FOR LOOP IS WRITTEN BCOZ WE IGNORED THE SalesInvoice ID(SIID) IN THE salesInvoiceHasItems JAVA FILE TO PREVENT THE RECURSION, THE FIELD SHOULD BE SET BEFORE SAVING BECAUSE NULL VALUE CANNOT BE SAVED.
                for (SalesInvoiceHasItems salesInvoiceHasItems : salesInvoice.getSalesInvoiceHasItemsList()){

                    salesInvoiceHasItems.setSales_invoice_id(salesInvoice);

                }

                salesInvoiceDao.save(salesInvoice);


                return "0";

            } catch (Exception ex) {

                return "Customer Payment Insert is incomplete : " + ex.getMessage();

            }

        } else {

            return "Customer Payment insert not completed : You dont have access";

        }

    }

}


