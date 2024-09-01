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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/supplier")
public class SupplierController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private SupplierRepository supplierDao;

    @Autowired
    private UserRepository userDao;

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private PrivilegeController privilegeController;

    @Autowired
    private SupplierStatusRepository supplierStatusDao;


    @GetMapping(value = "/getbyid/{id}", produces = "application/json")
    public Supplier getSupplierByPVId (@PathVariable("id") int id){

        return supplierDao.getReferenceById(id);

    }


    @GetMapping
    public ModelAndView SupplierUi(){

        ModelAndView Supplierui = new ModelAndView();

        Supplierui.setViewName("Supplier_Management.html");

        return Supplierui;

    }


    @GetMapping(value = "/findall", produces = "application/json")
    public List<Supplier> findAll (){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is existing in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilage(authentication.getName(), "SUPPLIER");

        if (loggedUserPrivilege != null && loggedUserPrivilege.get("sel")) {

            return supplierDao.findAll(Sort.by(Sort.Direction.DESC, "id"));

        }else {

            List<Supplier> supplierList = new ArrayList<>();
            return  supplierList;

        }

    }


    @GetMapping(value = "/list", produces = "application/json")
    public List<Supplier> supplierList (){

        return supplierDao.list();

    }

    //getting supplier by given supplier id to get bank details to supplier payment module
    @GetMapping(value = "/getbysupplierId/{sid}", produces = "application/json")
    public Supplier getSupplierById (@PathVariable("sid") int sid){

        return supplierDao.getSupplierBankDetailsBySupplierId(sid);

    }

    // [/supplier/listbyactivesupplierstatus]
    @GetMapping(value = "/listbyactivesupplierstatus", produces = "application/json")
    public List<Supplier> supplierListBySupplierStatus (){

        return supplierDao.getBySupplierStatusActive();

    }



    //Create delete mapping to delete User by using DeleteMapping Annotation
    @DeleteMapping
    public String deleteSupplier( @RequestBody Supplier supplier ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is existing in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "MODEL");

        if(!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("del")){


            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE
            //checking function to check weather the Model exist in the database
            Supplier existSupplier = supplierDao.getReferenceById(supplier.getId());

            // Creating a function to delete the Model from the database after checking the Model's existance.
            if(existSupplier != null){
                try{

                    //set auto insert Values
                    existSupplier.setDeleted_datetime(LocalDateTime.now()); // Setting the delete time of the user
                    existSupplier.setSupplier_status_id(supplierStatusDao.getReferenceById(3)); // Setting userStatus to deleted once the delete is done

                    supplierDao.save(existSupplier);

                    return "0";


                }catch(Exception ex){

                    return "Delete not completed : " + ex.getMessage();

                }
            }else{

                return "Delete Uncompleted : Supplier Not Available";

            }


        }else {

            return "Supplier Delete Uncompleted : You don't have access";

        }

    }


    //CREATE POST MAPPING FUNCTION TO ADD MODEL [/Model - POST]
   @PostMapping
    public String addSupplier( @RequestBody Supplier supplier){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "SUPPLIER");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("ins")){

            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE
            /*Supplier extBusinessRegNo = supplierDao.getByBusinessRegNo(supplier.getBusiness_reg_no());
            if ( extBusinessRegNo != null ){

                return "Supplier insert not completed : Supplier Business Reg No Duplicated (Business Reg No already Exist)";

            }*/

            //CHECKING THE SUPPLIER COMPANY REG Number EXIST OR NOT IN THE DATABASE.
            Supplier extCompanyRegNo = supplierDao.getByCompanyRegNo(supplier.getSupplier_company_reg_no());
            if ( extCompanyRegNo != null ){

                return "Supplier insert not completed : Supplier Company Reg No Duplicated (Company Reg No already Exist)";

            }

            //CHECKING THE SUPPLIER COMPANY E-MAIL EXIST OR NOT IN THE DATABASE.
            Supplier extCompanyEmail = supplierDao.getByCompanyEmail(supplier.getSupplier_company_email());
            if ( extCompanyEmail != null ){

                return "Supplier insert not completed : Supplier Company E-mail Duplicated (Company E-mail already Exist)";

            }

            //CHECKING THE SUPPLIER ACCOUNT NO EXIST OR NOT IN THE DATABASE.
            Supplier extAccountNo = supplierDao.getByCompanyAccountNo(supplier.getBank_account_number());
            if ( extAccountNo != null ){

                return "Supplier insert not completed : Supplier Account No Duplicated (Account No already Exist)";

            }

            try {

                String lastSupplierRegistrationNo = supplierDao.getLastSupplierRegistrationNo();
                String nextSupplierRegistrationNo = "";
                LocalDate currentDate  = LocalDate.now();

                int currentMonth = currentDate.getMonth().getValue();
                String currentYearString  = String.valueOf(currentDate.getYear());
                String currentMonthString = "";
                if (currentMonth < 10)
                    currentMonthString = "0" + currentMonth;


                if (lastSupplierRegistrationNo != null){

                    if (lastSupplierRegistrationNo.substring(3,7).equals(currentYearString)){

                        if (lastSupplierRegistrationNo.substring(7,9).equals(currentMonthString)){

                            nextSupplierRegistrationNo = "SRN" + currentDate.getYear() + currentMonthString + String.format("%03d" ,Integer.valueOf(lastSupplierRegistrationNo.substring(9)) + 1);

                        }else {

                            nextSupplierRegistrationNo = "SRN" + currentDate.getYear() + currentMonthString + "001";

                        }

                    }else {

                        nextSupplierRegistrationNo = "SRN" + currentDate.getYear() + currentMonthString + "001";

                    }

                }else {

                    nextSupplierRegistrationNo = "SRN" + currentDate.getYear() + currentMonthString + "001";

                }

                supplier.setSupplier_reg_no(nextSupplierRegistrationNo);


                //SET AUTO INSERT VALUE
                supplier.setAdded_datetime(LocalDateTime.now());
                supplier.setAdded_user_id(loggedUser);

                supplierDao.saveAndFlush(supplier);

                return "0";

            }catch (Exception ex){

                return "Supplier Insert is incomplete : " + ex.getMessage();

            }

        }else {

            return "Supplier insert not completed : You dont have access";

        }

    }


    //CREATE POST MAPPING FUNCTION TO UPDATE MODEL [/Model - PUT]
    @PutMapping
    public String updateItem( @RequestBody Supplier supplier ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "MODEL");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("upd")){

            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE
            Supplier extBusinessRegNo = supplierDao.getByBusinessRegNo(supplier.getSupplier_reg_no());
            if (extBusinessRegNo != null && supplier.getId() != extBusinessRegNo.getId()) {

                return "Supplier update not completed : Supplier Business Reg No already Exist";

            }


            //CHECKING THE EMAIL EXIST OR NOT IN THE DATABASE COZ IT IS UNIQUE.
            Supplier extCompanyRegNo = supplierDao.getByCompanyRegNo(supplier.getSupplier_company_reg_no());
            if (extCompanyRegNo != null && supplier.getId() != extCompanyRegNo.getId()) {

                return "Supplier update not completed : Supplier Company Reg No already Exist";

            }

            //CHECKING THE EMAIL EXIST OR NOT IN THE DATABASE COZ IT IS UNIQUE.
            Supplier extCompanyEmail = supplierDao.getByCompanyEmail(supplier.getSupplier_company_email());
            if (extCompanyEmail != null && supplier.getId() != extCompanyEmail.getId()) {

                return "Supplier update not completed : Supplier Company E-mail already Exist";

            }

            //CHECKING THE EMAIL EXIST OR NOT IN THE DATABASE COZ IT IS UNIQUE.
            Supplier extAccountNo = supplierDao.getByCompanyAccountNo(supplier.getBank_account_number());
            if (extAccountNo != null && supplier.getId() != extAccountNo.getId()) {

                return "Supplier update not completed : Supplier Account No already Exist";

            }

            try {

                //SET AUTO INSERT VALUE OF THE LAST UPDATED TIME ONCE THE UPDATE IS DONE BY THE USER.
                supplier.setLast_updated_datetime(LocalDateTime.now());
                supplier.setUpdated_user_id(loggedUser);

                //SAVE THE CHANGES
                supplierDao.save(supplier);

                return "0";

            }catch (Exception ex){

                return "Model update is incomplete : " + ex.getMessage();

            }

        }else {

            return "Model update not completed : You dont have access";

        }

    }


}
