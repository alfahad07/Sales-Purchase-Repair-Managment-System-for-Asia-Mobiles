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
@RequestMapping(value = "/quotation")
public class QuotationController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private QuotationRepository quotationDao;

    @Autowired
    private UserRepository userDao;

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private PrivilegeController privilegeController;

    @Autowired
    private QuotationStatusRepository quotationStatusDao;


    @GetMapping(value = "/getbyid/{id}", produces = "application/json")
    public Quotation getQuotationByPVId (@PathVariable("id") int id){

        return quotationDao.getReferenceById(id);

    }

    @GetMapping
    public ModelAndView quotationUi(){

        ModelAndView quotationui = new ModelAndView();

        quotationui.setViewName("Quotation_Management.html");

        return quotationui;

    }

    //GET MAPPING to get Quotation Number by given Supplier Name for filtering [/quotation/listbyquotation?cid=]
    @GetMapping(value = "/listbyquotation/{qid}", produces = "application/json")
    public List<Quotation> quotationNoByPurchaseOrderSupplierName(@PathVariable("qid") Integer qid) {

        return quotationDao.findByPurchaseOrderSupplierName(qid);

    }

    @GetMapping(value = "/list", produces = "application/json")
    public List<Quotation> quotationList () {

        return quotationDao.list();

    }

    @GetMapping(value = "/findall", produces = "application/json")
    public List< Quotation > findAll (){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is existing in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilage(authentication.getName(), "QUOTATION-REQUEST");

        if (loggedUserPrivilege != null && loggedUserPrivilege.get("sel")) {

            return quotationDao.findAll(Sort.by(Sort.Direction.DESC, "id"));

        }else {

            List<Quotation> quotationList = new ArrayList<>();
            return  quotationList;

        }

    }


    //Create delete mapping to delete User by using DeleteMapping Annotation
    @DeleteMapping
    public String deleteQuotation( @RequestBody Quotation quotation ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is existing in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "QUOTATION");

        if(!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("del")){


            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE
            //checking function to check weather the Model exist in the database
            Quotation existQuotation = quotationDao.getReferenceById(quotation.getId());

            // Creating a function to delete the Model from the database after checking the Model's existance.
            if(existQuotation != null){
                try{

                    //set auto insert Values
                    existQuotation.setDeleted_datetime(LocalDateTime.now()); // Setting the delete time of the user
                    existQuotation.setDeleted_user_id(loggedUser);
                    existQuotation.setQuotation_status_id(quotationStatusDao.getReferenceById(5)); // Setting quotationRequestStatus to deleted once the delete is done

                    quotationDao.save(existQuotation);

                    return "0";


                }catch(Exception ex){

                    return "Delete not completed : " + ex.getMessage();

                }
            }else{

                return "Delete Not Completed : Quotation Not Available";

            }


        }else {

            return "Quotation Delete not completed : You don't have access";

        }

    }


    //CREATE POST MAPPING FUNCTION TO ADD MODEL [/quotationrequest - POST]
    @PostMapping
    public String addQuotation( @RequestBody Quotation quotation ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "QUOTATION");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("ins")){

            try {

                //SET AUTO INSERT VALUE
                quotation.setAdded_datetime(LocalDateTime.now());
                quotation.setAdded_user_id(loggedUser);


                String lastQuotationNo = quotationDao.getLastQuotationNo();
                String nextQuotationNo = "";

                if (lastQuotationNo != null){

                    nextQuotationNo = "Q" + String.format("%06d" ,Integer.valueOf(lastQuotationNo.substring(2)) + 1);

                }else {

                    nextQuotationNo = "Q000001";

                }

                quotation.setQuotation_number(nextQuotationNo);


                for (QuotationHasModel quotationHasModel : quotation.getQuotationHasModelList()){
                    quotationHasModel.setQuotation_id(quotation);
                }

                quotationDao.save(quotation);

                return "0";


            }catch (Exception ex){

                return "Quotation Insert is incomplete : " + ex.getMessage();

            }

        }else {

            return "Quotation Insert not completed : You dont have access";

        }

    }


    //CREATE POST MAPPING FUNCTION TO UPDATE MODEL [/quotationrequest - PUT]
   @PutMapping
    public String updateQuotation(@RequestBody Quotation quotation) {

       //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

       //Checking the logged user is exixting in the  database. ( Authenticated user )
       Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


       //Getting authenticated logged user's username
       User loggedUser = userDao.findUserByUsername(authentication.getName());


       //Created a HashMap instance or copy
       HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "QUOTATION");

       if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("upd")) {

           //checking function to check weather the Quotation exist in the database
           Quotation existQuotation = quotationDao.getReferenceById(quotation.getId());

           if (existQuotation != null) {

               try {

                   //SET AUTO INSERT VALUE OF THE LAST UPDATED TIME ONCE THE UPDATE IS DONE BY THE USER.
                   quotation.setLast_updated_datetime(LocalDateTime.now());
                   quotation.setUpdated_user_id(loggedUser);

                   //SAVE THE CHANGES
                   for (QuotationHasModel quotationHasModel : quotation.getQuotationHasModelList()) {
                       quotationHasModel.setQuotation_id(quotation);
                   }
                   quotationDao.save(quotation);

                   return "0";

               } catch (Exception ex) {

                   return "Quotation update is incomplete : " + ex.getMessage();

               }

           } else {

               return "Update Not Completed : Quotation Not Available";

           }

       } else {

           return "Quotation update not completed : You dont have access";

       }

   }


}
