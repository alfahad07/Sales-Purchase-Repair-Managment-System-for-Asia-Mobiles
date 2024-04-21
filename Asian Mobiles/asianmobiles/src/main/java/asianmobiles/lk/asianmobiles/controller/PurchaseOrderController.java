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

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/purchaseorder")
public class PurchaseOrderController {


    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private PrivilegeController privilegeController;
    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private PurchaseOrderRepository purchaseOrderDao;

    /*@Autowired
    private  PurchaseOrderHasModelRepository purchaseOrderHasModelDao;*/
    @Autowired
    private UserRepository userDao;

    @Autowired
    private PurchaseOrderStatusRepository purchaseOrderStatusDao;



    @GetMapping(value = "/getbyid/{id}", produces = "application/json")
    public PurchaseOrder getPurchaseOrderByPVId (@PathVariable("id") int id){

        return purchaseOrderDao.getReferenceById(id);

    }


    @GetMapping
    //creating a function to display the PREORDER UI.
    public ModelAndView purchaseOrderUi() {

        // create ModelAndView object called employeeui
        ModelAndView purchseOrderui = new ModelAndView();

        //set employee.js.html
        purchseOrderui.setViewName("PurchaseOrder_Management.html");

        return purchseOrderui;
    }


    @GetMapping(value = "/findall", produces = "application/json")
    public List<PurchaseOrder> findAll (){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is existing in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilage(authentication.getName(), "PURCHASE-ORDER");

        if (loggedUserPrivilege != null && loggedUserPrivilege.get("sel")) {

            return purchaseOrderDao.findAll(Sort.by(Sort.Direction.DESC, "id"));

        }else {

            List<PurchaseOrder> purchaseOrderList = new ArrayList<>();
            return  purchaseOrderList;

        }

    }


    //GET MAPPING to get purchaseOrder Number by given GRN Supplier Name for filtering [/purchaseorder/listbypurchaseorder?cid=]
    @GetMapping(value = "/listbypurchaseorder/{pid}", produces = "application/json")
    public List<PurchaseOrder> purchaseOrderNoByGoodsReceiveNoteSupplier(@PathVariable("pid") Integer pid) {

        return purchaseOrderDao.findByPurchaseOrderSupplierName(pid);

    }


    @GetMapping(value = "/list", produces = "application/json")
    public List<PurchaseOrder> customerList () {

        return purchaseOrderDao.list();

    }

    //Create delete mapping to delete User by using DeleteMapping Annotation
    @DeleteMapping
    public String deletePurchaseOrder( @RequestBody PurchaseOrder purchaseOrder ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is existing in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "PURCHASE-ORDER");

        if(!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("del")){


            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE
            //checking function to check weather the Model exist in the database
            PurchaseOrder existPurchaseOrder = purchaseOrderDao.getReferenceById(purchaseOrder.getId());

            // Creating a function to delete the Model from the database after checking the Model's existance.
            if(existPurchaseOrder != null){
                try{

                    //set auto insert Values
                    existPurchaseOrder.setDeleted_datetime(LocalDateTime.now()); //Setting the delete time of the user...
                    existPurchaseOrder.setPurchase_order_status_id(purchaseOrderStatusDao.getReferenceById(5)); //Setting Status to "deleted" once the delete is done...

                    purchaseOrderDao.save(existPurchaseOrder);

                    return "0";


                }catch(Exception ex){

                    return "Delete not completed : " + ex.getMessage();

                }
            }else{

                return "Delete Not Completed : Purchase-Order Not Available";

            }


        }else {

            return "Purchase-Order Delete not completed : You don't have access";

        }

    }


    @PostMapping
    @Transactional
    public String addInnerPurchaseOrder( @RequestBody PurchaseOrder purchaseOrder ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "PURCHASE-ORDER");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("ins")){


            try {


                //SET AUTO INSERT VALUE
                purchaseOrder.setAdded_datetime(LocalDateTime.now());
                purchaseOrder.setAdded_user_id(loggedUser);


                String lastPurchaseOrderNo = purchaseOrderDao.getLastPurchaseOrderCode();
                String nextPurchaseOrderNo = "";
                LocalDate currentDate = LocalDate.now();

                int currentMonth          = currentDate.getMonth().getValue();
                String currentYearString  = String.valueOf(currentDate.getYear());
                String currentMonthString = "";
                if (currentMonth < 10)
                    currentMonthString = "0" + currentMonth;


                if (lastPurchaseOrderNo != null){

                    if (lastPurchaseOrderNo.substring(2,6).equals(currentYearString)){

                        if (lastPurchaseOrderNo.substring(6,8).equals(currentMonthString)){

                            nextPurchaseOrderNo = "PO" + currentDate.getYear() + currentMonthString + String.format("%03d" ,Integer.valueOf(lastPurchaseOrderNo.substring(8)) + 1);

                        }else {

                            nextPurchaseOrderNo = "PO" + currentDate.getYear() + currentMonthString + "001";

                        }

                    }else {

                        nextPurchaseOrderNo = "PO" + currentDate.getYear() + currentMonthString + "001";

                    }

                }else {

                    nextPurchaseOrderNo = "PO" + currentDate.getYear() + currentMonthString + "001";

                }

                purchaseOrder.setPurchase_order_number(nextPurchaseOrderNo);


                for (PurchaseOrderHasModel purchaseOrderHasModel : purchaseOrder.getPurchaseOrderHasModelList()){

                    purchaseOrderHasModel.setPurchase_order_id(purchaseOrder);

                }

                purchaseOrderDao.save(purchaseOrder);

                return "0";

            }catch (Exception ex){

                return "Purchase-Order Insert is incomplete : " + ex.getMessage();

            }

        }else {

            return "Purchase-Order insert not completed : You dont have access";

        }

    }


    //CREATE POST MAPPING FUNCTION TO UPDATE MODEL [/Model - PUT]
    @PutMapping
    public String updatePurchaseOrder( @RequestBody  PurchaseOrder purchaseOrder ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "PURCHASE-ORDER");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("upd")){


            //checking function to check weather the Quotation exist in the database
            PurchaseOrder existPurchaseOrder = purchaseOrderDao.getReferenceById(purchaseOrder.getId());

            if (existPurchaseOrder != null){

                try {

                    //SET AUTO INSERT VALUE OF THE LAST UPDATED TIME ONCE THE UPDATE IS DONE BY THE USER.
                    purchaseOrder.setLast_updated_datetime(LocalDateTime.now());
                    purchaseOrder.setUpdated_user_id(loggedUser);

                    //SAVE THE CHANGES
                    for (PurchaseOrderHasModel purchaseOrderHasModel : purchaseOrder.getPurchaseOrderHasModelList()) {
                        purchaseOrderHasModel.setPurchase_order_id(purchaseOrder);
                    }
                    purchaseOrderDao.save(purchaseOrder);

                    return "0";

                }catch (Exception ex){

                    return "Purchase-Order update is incomplete : " + ex.getMessage();

                }

            }else{

                return "Update Not Completed : Purchase-Order Not Available";

            }

        }else {

            return "Purchase-Order update not completed : You dont have access";

        }

    }


}
