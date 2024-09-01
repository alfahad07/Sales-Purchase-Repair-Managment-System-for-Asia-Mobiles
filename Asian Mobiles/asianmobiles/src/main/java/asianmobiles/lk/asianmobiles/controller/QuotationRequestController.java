package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.*;
import asianmobiles.lk.asianmobiles.repository.QuotationRequestRepository;
import asianmobiles.lk.asianmobiles.repository.QuotationRequestStatusRepository;
import asianmobiles.lk.asianmobiles.repository.UserRepository;
import org.hibernate.sql.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.querydsl.QPageRequest;
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
@RequestMapping(value = "/quotationrequest")
public class QuotationRequestController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private QuotationRequestRepository quotationRequestDao;

    @Autowired
    private UserRepository userDao;

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private PrivilegeController privilegeController;

    @Autowired
    private QuotationRequestStatusRepository quotationRequestStatusDao;


    @GetMapping(value = "/getbyid/{id}", produces = "application/json")
    public QuotationRequest getQuotationRequestByPVId (@PathVariable("id") int id){

        return quotationRequestDao.getReferenceById(id);

    }


    @GetMapping
    public ModelAndView quotationRequestUi(){

        ModelAndView quotationRequestui = new ModelAndView();

        quotationRequestui.setViewName("QuotationRequest_Management.html");

        return quotationRequestui;

    }

    @GetMapping(value = "/list", produces = "application/json")
    public List<QuotationRequest> modelList () {

        return quotationRequestDao.list();

    }


    @GetMapping(value = "/findall", produces = "application/json")
    public List< QuotationRequest > findAll (){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is existing in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilage(authentication.getName(), "QUOTATION-REQUEST");

        if (loggedUserPrivilege != null && loggedUserPrivilege.get("sel")) {

            return quotationRequestDao.findAll(Sort.by(Sort.Direction.DESC, "id"));

        }else {

            List<QuotationRequest> quotationRequestList = new ArrayList<>();
            return  quotationRequestList;

        }

    }

    //GET MAPPING to get Quotation Request code by given Supplier for filtering [/quotationrequest/listbysuppliers?sid=]
    @GetMapping(value = "/listbysuppliers/{sid}", produces = "application/json")
    public List<QuotationRequest> quotationRequestListBySupplier(@PathVariable("sid") Integer sid) {

        return quotationRequestDao.getByActiveSupplierName(sid);

    }


    //Create delete mapping to delete User by using DeleteMapping Annotation
    @DeleteMapping
    public String deleteQuotationRequest( @RequestBody QuotationRequest quotationRequest ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is existing in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "QUOTATION-REQUEST");

        if(!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("del")){


            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE
            //checking function to check weather the Model exist in the database
            QuotationRequest existQuotationRequest = quotationRequestDao.getReferenceById(quotationRequest.getId());

            // Creating a function to delete the Model from the database after checking the Model's existance.
            if(existQuotationRequest != null){
                try{

                    //set auto insert Values
                    existQuotationRequest.setDeleted_datetime(LocalDateTime.now()); // Setting the delete time of the user
                    existQuotationRequest.setDeleted_user_id(loggedUser);
                    existQuotationRequest.setQuotation_request_status_id(quotationRequestStatusDao.getReferenceById(5)); // Setting quotationRequestStatus to deleted once the delete is done

                    quotationRequestDao.save(existQuotationRequest);

                    return "0";


                }catch(Exception ex){

                    return "Delete not completed : " + ex.getMessage();

                }
            }else{

                return "Delete Not Completed : Quotation Request Not Available";

            }


        }else {

            return "Quotation Request Delete not completed : You don't have access";

        }

    }


    //CREATE POST MAPPING FUNCTION TO ADD MODEL [/quotationrequest - POST]
    @PostMapping
    public String addQuotationRequest( @RequestBody QuotationRequest quotationRequest ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "QUOTATION-REQUEST");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("ins")){

            try {

                //SET AUTO INSERT VALUE
                quotationRequest.setAdded_datetime(LocalDateTime.now());
                quotationRequest.setAdded_user_id(loggedUser);


                String lastQuotationRequestNo = quotationRequestDao.getLastQuotationRequestNo();
                String nextQuotationRequestNo = "";

                if (lastQuotationRequestNo != null){

                    nextQuotationRequestNo = "QR" + String.format("%06d" ,Integer.valueOf(lastQuotationRequestNo.substring(2)) + 1);

                }else {

                    nextQuotationRequestNo = "QR000001";

                }

                quotationRequest.setQr_number(nextQuotationRequestNo);


                //SAVE THE CHANGES
                quotationRequestDao.save(quotationRequest);
                return "0";


            }catch (Exception ex){

                return "Quotation Request Insert is incomplete : " + ex.getMessage();

            }

        }else {

            return "Quotation Request insert not completed : You dont have access";

        }

    }


    //CREATE POST MAPPING FUNCTION TO UPDATE MODEL [/quotationrequest - PUT]
   @PutMapping
    public String updateQuotationRequest( @RequestBody QuotationRequest quotationRequest ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "QUOTATION-REQUEST");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("upd")){

            //checking function to check weather the QR exist in the database
            QuotationRequest existQuotationRequest = quotationRequestDao.getReferenceById(quotationRequest.getId());

            if (existQuotationRequest != null){

                try {

                    //SET AUTO INSERT VALUE OF THE LAST UPDATED TIME ONCE THE UPDATE IS DONE BY THE USER.
                    quotationRequest.setLast_updated_datetime(LocalDateTime.now());
                    quotationRequest.setUpdated_user_id(loggedUser);

                    //SAVE THE CHANGES
                    quotationRequestDao.save(quotationRequest);

                    return "0";

                }catch (Exception ex){

                    return "Quotation Request update is incomplete : " + ex.getMessage();

                }

            }else {

                return  "Update Not Completed : Quotation Request Not Available";

            }

        }else {

            return "Quotation Request update not completed : You dont have access";

        }

    }


}
