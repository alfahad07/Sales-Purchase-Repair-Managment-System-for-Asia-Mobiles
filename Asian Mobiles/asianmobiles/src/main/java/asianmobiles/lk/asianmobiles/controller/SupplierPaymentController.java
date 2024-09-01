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
@RequestMapping(value = "/supplierpayment")
public class SupplierPaymentController {


    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private PrivilegeController privilegeController;

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private SupplierRepository supplierDao;

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private SupplierPaymentRepository supplierPaymentDao;

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private GoodsReceiveNoteRepository goodsReceiveNoteDao;
    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private GoodsReceiveNoteStatusRepository goodsReceiveNoteStatusDao;
    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private PaymentStatusRepository paymentStatusDao;
    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private UserRepository userDao;

    // to take each supplier payment object for update and to view btn
    @GetMapping(value = "/getbyid/{id}", produces = "application/json")
    public SupplierPayment getSupplierPaymentByPVId(@PathVariable("id") int id) {

        return supplierPaymentDao.getReferenceById(id);

    }

    // creating getMapping annotation to get the UserManagement UI.
    @GetMapping
    //creating a function to display the UserManagement UI.
    public ModelAndView supplierPaymentUi() {

        // create ModelAndView object called userui
        ModelAndView supplierPaymentui = new ModelAndView();

        //set SupplierPayment_Management.html
        supplierPaymentui.setViewName("SupplierPayment_Management.html");

        return supplierPaymentui;


    }

    //Create get mapping to take all the user data from the database to display on the browser as JSON OBJECT--->[/user]
    @GetMapping(value = "/findall", produces = "application/json")
    //attribute "produces" used to take the data as which type to display on the browser, "application/json" is used to take the data as JSON OBJECT.
    private List<SupplierPayment> findAll() {

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...
        //Checking the logged user is existing in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilage(authentication.getName(), "PURCHASE-PAYMENT");

        if (loggedUserPrivilege != null && loggedUserPrivilege.get("sel")) {

            return supplierPaymentDao.findAll(Sort.by(Sort.Direction.DESC, "id"));

        } else {

            List<SupplierPayment> supplierPaymentList = new ArrayList<>();
            return supplierPaymentList;

        }

    }



    @GetMapping(value = "/list", produces = "application/json")
    public List<SupplierPayment> supplierPaymentList () {

        return supplierPaymentDao.list();

    }


    //Create delete mapping to delete SupplierPayment by using DeleteMapping Annotation
    @DeleteMapping
    public String deleteSupplierPayment(@RequestBody SupplierPayment supplierPayment) {

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "PURCHASE-PAYMENT");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("del")) {


            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE
            //checking function to check wether the employee.js exist in the database
            SupplierPayment existSupplierPayment = supplierPaymentDao.getReferenceById(supplierPayment.getId());

            // Creating a function to delete the employee.js from the database after checking the employee.js's existance.
            if (existSupplierPayment != null) {
                try {

                    //set auto insert Values
                    existSupplierPayment.setDeleted_datetime(LocalDateTime.now()); // Setting the delete time of the employee.js
                    existSupplierPayment.setPayment_status_id(paymentStatusDao.getReferenceById(3)); // Setting employeeStatus to deleted once the delete is done
                    existSupplierPayment.setDeleted_user_id(loggedUser);

                    supplierPaymentDao.save(existSupplierPayment);

                    return "0";


                } catch (Exception ex) {

                    return "Delete not completed : " + ex.getMessage();

                }
            } else {

                return "Delete Not Completed : Supplier Payment Not Available";

            }


        } else {

            return "Supplier Payment Delete not completed : You don't have access";

        }

    }


    //CREATE POST MAPPING FUNCTION TO ADD SUPPLIER PAYMENT [/supplierpayment - POST]
    @PostMapping
    public String addSupplierPayment(@RequestBody SupplierPayment supplierPayment) {

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is existing in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "PURCHASE-PAYMENT");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("ins")) {


            try {

                //SET AUTO INSERT VALUE
                supplierPayment.setAdded_datetime(LocalDateTime.now());
                supplierPayment.setAdded_user_id(loggedUser);

                //SUPPLIER PAYMENT BILL NO AUTO GENERATE
                String lastSupplierPaymentBillNo = supplierPaymentDao.getLastSalesPaymentBillNo();
                String nextSupplierPaymentBillNo = "";

                if (lastSupplierPaymentBillNo != null){

                    nextSupplierPaymentBillNo = "SP" + String.format("%08d" ,Integer.valueOf(lastSupplierPaymentBillNo.substring(2)) + 1);

                }else {

                    nextSupplierPaymentBillNo = "SP00000001";

                }

                supplierPayment.setBill_number(nextSupplierPaymentBillNo); // setiing the generated supplierpayment bill no


                //SAVE THE CHANGES
                SupplierPayment newSupplierPayment = supplierPaymentDao.save(supplierPayment);

                //Need to change the Goods_Receive_Note Status to received
                GoodsReceiveNote goodsReceiveNote = goodsReceiveNoteDao.getReferenceById(newSupplierPayment.getGoods_recieve_note_id().getId());
                goodsReceiveNote.setGoods_receive_note_status_id(goodsReceiveNoteStatusDao.getReferenceById(2));

                //THE FOR LOOP IS WRITTEN BCOZ WE IGNORED THE GRN ID(GrnID) IN THE GoodsReceiveNoteHasModel JAVA FILE TO PREVENT THE RECURSION, THE FIELD SHOULD BE SET BEFORE SAVING BECAUSE NULL VALUE CANNOT BE SAVED.
                for (GoodsReceiveNoteHasModel goodsReceiveNoteHasModel : goodsReceiveNote.getGoodsReceiveNoteHasModelList()){

                    goodsReceiveNoteHasModel.setGoods_receive_note_id(goodsReceiveNote);
                }

                goodsReceiveNoteDao.save(goodsReceiveNote);


                //
                Supplier supplierArreas = supplierDao.getReferenceById(newSupplierPayment.getSupplier_id().getId());
                supplierArreas.setArreas_amount(newSupplierPayment.getBalance_amount());

                supplierDao.save(supplierArreas);


                return "0";

            } catch (Exception ex) {

                return "Supplier Payment Insert is incomplete : " + ex.getMessage();

            }

        } else {

            return "Supplier Payment insert not completed : You dont have access";

        }

    }

}


