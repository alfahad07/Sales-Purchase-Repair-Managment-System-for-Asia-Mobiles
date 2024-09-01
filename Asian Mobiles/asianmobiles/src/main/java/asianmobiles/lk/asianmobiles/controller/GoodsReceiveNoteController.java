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
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/goodsreceivenote")
public class GoodsReceiveNoteController {


    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private PrivilegeController privilegeController;

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private GoodsReceiveNoteRepository goodsReceiveNoteDao;

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private PurchaseOrderRepository purchaseOrderDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private GoodsReceiveNoteStatusRepository goodsReceiveNoteStatusDao;

    @Autowired
    private PurchaseOrderStatusRepository purchaseOrderStatusDao;

    @Autowired
    private ItemStatusRepository itemStatusDao;

    @Autowired
    private ItemsRepository itemDao;


    //GETTING GRN OBJECT BY GIVEN ID FROM DATABASE
    @GetMapping(value = "/getbyid/{id}", produces = "application/json")
    public GoodsReceiveNote getGoodsReceiveNoteByPVId (@PathVariable("id") int id){

        return goodsReceiveNoteDao.getReferenceById(id);

    }


    @GetMapping
    //creating a function to display the GoodsReceiveNote UI.
    public ModelAndView goodsReceiveNoteUi() {

        // create ModelAndView object called goodsReceiveNoteui
        ModelAndView goodsReceiveNoteui = new ModelAndView();

        //set GoodsReceiveNote_Management.html to goodsReceiveNoteui...
        goodsReceiveNoteui.setViewName("GoodsReceiveNote_Management.html");

        return goodsReceiveNoteui;
    }

    //GETTING ALL THE GRN
    @GetMapping(value = "/findall", produces = "application/json")
    public List<GoodsReceiveNote> findAll (){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is existing in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilage(authentication.getName(), "GOODS-RECEIVE-NOTE");

        if (loggedUserPrivilege != null && loggedUserPrivilege.get("sel")) {

            return goodsReceiveNoteDao.findAll(Sort.by(Sort.Direction.DESC, "id"));

        }else {

            List<GoodsReceiveNote> purchaseOrderList = new ArrayList<>();
            return  purchaseOrderList;

        }

    }

    // GETING ONLY NEEDED DETAILS OF GRN
    @GetMapping(value = "/list", produces = "application/json")
    public List<GoodsReceiveNote> getGoodsReceiveNoteList (){

        return goodsReceiveNoteDao.list();

    }

    //
    @GetMapping(value = "/getgrncodebysupplier/{sid}", produces = "application/json")
    public List<GoodsReceiveNote> getGoodsReceiveNoteCodeBySupplier (@PathVariable("sid") int sid){

        return goodsReceiveNoteDao.getGrnCodeBySupplier(sid);

    }

    //
    @GetMapping(value = "/getgrnnettotalbygrn/{gid}", produces = "application/json")
    public GoodsReceiveNote getGoodsReceiveNoteCodeByGrnId (@PathVariable("gid") int gid){

        return goodsReceiveNoteDao.getGrnNetTotalByGrn(gid);

    }


    //Create delete mapping to delete User by using DeleteMapping Annotation
    @DeleteMapping
    public String deleteGoodsReceiveNote( @RequestBody GoodsReceiveNote goodsReceiveNote ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is existing in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "GOODS-RECEIVE-NOTE");

        if(!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("del")){


            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE
            //checking function to check weather the Model exist in the database
            GoodsReceiveNote existGoodsReceiveNote = goodsReceiveNoteDao.getReferenceById(goodsReceiveNote.getId());

            // Creating a function to delete the Model from the database after checking the Model's existance.
            if(existGoodsReceiveNote != null){
                try{

                    //set auto insert Values
                    existGoodsReceiveNote.setDeleted_datetime(LocalDateTime.now()); //Setting the delete time of the user...
                    existGoodsReceiveNote.setGoods_receive_note_status_id(goodsReceiveNoteStatusDao.getReferenceById(3)); //Setting Status to "deleted" once the delete is done...

                    goodsReceiveNoteDao.save(existGoodsReceiveNote);

                    return "0";


                }catch(Exception ex){

                    return "Delete not completed : " + ex.getMessage();

                }
            }else{

                return "Delete Not Completed : Goods Receive Note Not Available";

            }


        }else {

            return "Goods Receive Note Delete not completed : You don't have access";

        }

    }


    //CREATE POST MAPPING FUNCTION TO ADD GRN
    @PostMapping
    @Transactional
    public String addInnerGoodsReceiveNote( @RequestBody GoodsReceiveNote goodsReceiveNote ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "GOODS-RECEIVE-NOTE");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("ins")){


            try {

                //SET AUTO INSERT VALUE
                goodsReceiveNote.setAdded_datetime(LocalDateTime.now());
                goodsReceiveNote.setAdded_user_id(loggedUser);
                goodsReceiveNote.setPaid_amount(BigDecimal.ZERO);


                String lastGoodsReceiveNoteCodeNo = goodsReceiveNoteDao.getLastGrnNo();
                String nextGoodsReceiveNoteCodeNo = "";
                LocalDate currentDate = LocalDate.now();

                int currentMonth          = currentDate.getMonth().getValue();
                String currentYearString  = String.valueOf(currentDate.getYear());
                String currentMonthString = "";
                if (currentMonth < 10)
                    currentMonthString = "0" + currentMonth;


                if (lastGoodsReceiveNoteCodeNo != null){

                    if (lastGoodsReceiveNoteCodeNo.substring(3,7).equals(currentYearString)){

                        if (lastGoodsReceiveNoteCodeNo.substring(7,9).equals(currentMonthString)){

                            nextGoodsReceiveNoteCodeNo = "GRN" + currentDate.getYear() + currentMonthString + String.format("%03d" ,Integer.valueOf(lastGoodsReceiveNoteCodeNo.substring(9)) + 1);

                        }else {

                            nextGoodsReceiveNoteCodeNo = "GRN" + currentDate.getYear() + currentMonthString + "001";

                        }

                    }else {

                        nextGoodsReceiveNoteCodeNo = "GRN" + currentDate.getYear() + currentMonthString + "001";

                    }

                }else {

                    nextGoodsReceiveNoteCodeNo = "GRN" + currentDate.getYear() + currentMonthString + "001";

                }

                goodsReceiveNote.setGrn_code(nextGoodsReceiveNoteCodeNo);


                //TO SET ITEM CODE TO THE RECEIVED ITEMS IN GRN IS PROVIDED BELOW
                //IC20240003 - IC20240004 - IC20240005 | IC20240006 IC20240007 IC20240008 IC20240009
                String nextItemCode = itemDao.getNextCode(); //GOT THE NEXT CODE
                int totalRecievedItemCount = 0;

                //A for loop to get the total received quantity from the inner form of the grn
                for (GoodsReceiveNoteHasModel goodsReceiveNoteHasModel : goodsReceiveNote.getGoodsReceiveNoteHasModelList()){
                    totalRecievedItemCount = totalRecievedItemCount + goodsReceiveNoteHasModel.getReceived_quantity(); //took the total received quantity from the inner form of the grn. EX:- 10 ITEMS RECEIVED
                }

                String[] itemCodeList =  new String[totalRecievedItemCount]; //Created a new array in the length of total recieved quantity to generate ItemCode
                itemCodeList[0] = nextItemCode; //Setting the next Item code to the 1st item in the array index [0].

                for (int i = 1; i < totalRecievedItemCount; i++) { // i = 1 bcoz the itemcode for the 1st item in the array is set index[0].

                    String nextCode = nextItemCode.substring(0,6) + String.format("%04d" ,Integer.valueOf(nextItemCode.substring(6)) + i); //Creating next itemcode from the 2nd item in the array to last item in the array.
                    itemCodeList[i] = nextCode; //Setting the created itemcode to the item in the array.
                }

                int k = 0;

                for (GoodsReceiveNoteHasModel goodsReceiveNoteHasModel : goodsReceiveNote.getGoodsReceiveNoteHasModelList()){
                    goodsReceiveNoteHasModel.setGoods_receive_note_id(goodsReceiveNote);
                    if (goodsReceiveNoteHasModel.getModel_id().getSub_catergory_id().getCategory_id().getName() == "Phone"){
                        for (Items item : goodsReceiveNoteHasModel.getItemsList()) {
                            item.setGoods_receive_note_has_model_id(goodsReceiveNoteHasModel);
                            item.setItem_status_id(itemStatusDao.getReferenceById(1));
                            item.setItem_name(goodsReceiveNoteHasModel.getModel_id().getModel_name());
                            item.setModel_id(goodsReceiveNoteHasModel.getModel_id());
                            item.setAdded_user_id(loggedUser);
                            item.setAdded_datetime(LocalDateTime.now());
                            item.setItem_code_number(itemCodeList[k]);
                            k++;

                        }
                    }else {

                        List<Items> itemsList = new ArrayList<>();
                        for (int i=0 ; i < goodsReceiveNoteHasModel.getReceived_quantity() ; i++) {

                            Items item = new Items();
                            item.setGoods_receive_note_has_model_id(goodsReceiveNoteHasModel);
                            item.setItem_status_id(itemStatusDao.getReferenceById(1));
                            item.setItem_name(goodsReceiveNoteHasModel.getModel_id().getModel_name());
                            item.setModel_id(goodsReceiveNoteHasModel.getModel_id());
                            item.setAdded_user_id(loggedUser);
                            item.setAdded_datetime(LocalDateTime.now());
                            item.setItem_code_number(itemCodeList[k]);
                            k++;
                            itemsList.add(item);

                        }
                        goodsReceiveNoteHasModel.setItemsList(itemsList);
                    }

                }


                GoodsReceiveNote newGrn = goodsReceiveNoteDao.save(goodsReceiveNote);


                //Need to change the Purchase-Order Status to received
                PurchaseOrder purchaseOrder = newGrn.getPurchase_order_id();
                purchaseOrder.setPurchase_order_status_id(purchaseOrderStatusDao.getReferenceById(2));

                    //THE FOR LOOP IS WRITTEN BCOZ WE IGNORED THE PURCHASE ORDER ID(POID) IN THE PurchaseOrderHasModel JAVA FILE TO PREVENT THE RECURSION, THE FIELD SHOULD BE SET BEFORE SAVING BECAUSE NULL VALUE CANNOT BE SAVED.
                    for (PurchaseOrderHasModel purchaseOrderHasModel : purchaseOrder.getPurchaseOrderHasModelList()){

                        purchaseOrderHasModel.setPurchase_order_id(purchaseOrder);
                    }

                purchaseOrderDao.save(purchaseOrder);



                return "0";

            }catch (Exception ex){

                return "Goods Receive Note Insert is incomplete : " + ex.getMessage();

            }

        }else {

            return "Goods Receive Note insert not completed : You dont have access";

        }

    }

}
