
window.addEventListener('load', loadUserInterface);

//create function for browser on load event
function loadUserInterface() {

    loggedUserPrivilage = getServiceRequest("/userprivilage/bymodule?modulename=PRE-ORDER")

    //CALLED USER FORM AND TABLE BOX OR CONTAINER 3D ROTATE
    formAndTableContainer3DRotate();

    //CALLED USER FORM AND TABLE BOX OR CONTAINER OVERLAYPANEL SLIDER TO SLIDE LEFT AND RIGHT
    moveRightAndLeftOverlayPanel();

    //CALLED REFRESH TABLE FUNCTION
    refreshTable();

    //CALLED REFRESH FORM FUNCTION
    refreshForm();

}


//create function for refresh  table
const refreshTable = () => {

    //create Array for employees
    PreOrders = new Array();

    PreOrders = getServiceRequest("/preorder/findall");

    //create display property list
    let DisplayPropertyList = ['pre_order_code','customer_id.fullname','model','total_amount','required_date','pre_order_status_id.name'];

    //create display property list type
    let DisplayPropertyListType = ['text','object',getModelName,getTotalAmount,'text','object'];

    // calling filldataintotable function to fill data
    fillDataIntoTable(tablePreOrder, PreOrders, DisplayPropertyList, DisplayPropertyListType, formRefill, rowDelete, rowView, true,loggedUserPrivilage);

    //Invisibling the Delete Button in the table when the Status is deleted (Once Deleted the Details or row, the Delete Btn will Disappear)
    for (let index in PreOrders){

        if(PreOrders[index].pre_order_status_id.name == "Deleted")
            tablePreOrder.children[1].children[index].children[7].children[1].style.display = "none";

    }

    //need to add jquery table
    $('#tablePreOrder').dataTable();


}

const getModelName = (ob) => {

    let orderModelName = "";

    for (let index in ob.preOrderHasModelList){

        if(ob.preOrderHasModelList.length-1 == index )
            orderModelName = orderModelName + ob.preOrderHasModelList[index].model_id.model_name;
        else
            orderModelName = orderModelName + ob.preOrderHasModelList[index].model_id.model_name + ", ";

    }

    return orderModelName;

}

const getTotalAmount = (ob) => {

    return "Rs." + parseFloat(ob.total_amount).toFixed(2);

}

const refreshForm = () => {


    preOrder = new Object();
    oldPreOrder = null;

    preOrder.preOrderHasModelList = new Array();

    Customers = getServiceRequest("/customer/list");
    fillSelectFeild(preOrderCustomer, "Select Pre-Order Customer", Customers, "fullname")

    Statuses = getServiceRequest("/preorderstatus/list")
    fillSelectFeild(preOrderStatus, "Select Pre-Order Status", Statuses, "name", "Initial")


    //CLEARING THE MODEL DETAILS IN THE ATTRIBUTE FIELDS IN THE FORM AFTER ADDING THE MODELS

    preOrderCustomer.style.color        = "grey";
    preOrderCustomer.style.borderBottom = "none";

    preOrderStatus.style.color          = "green";
    preOrderStatus.style.borderBottom   = "solid";

    preOrderRequiredDate.value = "";

    preOrderTotalAmount.value  = "";
    $('#preOrderTotalAmount').css("pointer-events", "none");
    $('#preOrderTotalAmount').css("cursor", "pointer");


    // SETTING THE DATE FOR PRE-ORDER

    let currentDateForMin = new Date();
    currentDateForMin.setDate(currentDateForMin.getDate() + 2);

    preOrderRequiredDate.min = currentDateForMin.getFullYear() + getMontahDate(currentDateForMin);


    let currentDateForMax = new Date();
    currentDateForMax.setDate(currentDateForMax.getDate() + 30);

    preOrderRequiredDate.max = currentDateForMax.getFullYear() + getMontahDate(currentDateForMax);

    refreshInnerFormAndTable();

    disableAddUpdateBtn(true, false);

}


const disableAddUpdateBtn = (addBtn, updBtn) => {


    if( addBtn && loggedUserPrivilage.ins ){

        btnAdd.disabled = false;
        $('#btnAdd').css("pointer-events", "all");
        $('#btnAdd').css("cursor", "pointer");


    }else {

        btnAdd.disabled = true;
        $('#btnAdd').css("pointer-events", "all");
        $('#btnAdd').css("cursor", "not-allowed");

    }


    if( updBtn && loggedUserPrivilage.upd ){

        btnUpdate.disabled = false;
        $('#btnUpdate').css("pointer-events", "all");
        $('#btnUpdate').css("cursor", "pointer");


    }else {

        btnUpdate.disabled = true;
        $('#btnUpdate').css("pointer-events", "all");
        $('#btnUpdate').css("cursor", "not-allowed");

    }


}

const refreshInnerFormAndTable = () => {

    //INNER FORM
    preOrderHasModel = new Object();
    oldPreOrderHasModel = null;


    innerModels = getServiceRequest("/model/list")
    fillSelectFeild2(preOrderModel, "Select Model", innerModels,"model_number" ,"model_name",)
    preOrderModel.style.color        = "grey";
    preOrderModel.style.borderBottom = "none";
    $('#preOrderModel').css("pointer-events", "all");
    $('#preOrderModel').css("cursor", "pointer");

    preOrderModel.value      = "";
    preOrderUnitPrice.value  = "";
    $('#preOrderUnitPrice').css("pointer-events", "none");
    $('#preOrderUnitPrice').css("cursor", "not-allowed");
    preOrderQuantity.value   = "";
    preOrderLineTotal.value  = "";
    $('#preOrderLineTotal').css("pointer-events", "none");
    $('#preOrderLineTotal').css("cursor", "not-allowed");

    //Disabling the inner Add Btn...
    innerFormBtnAdd.disabled = true;
    $('#innerFormBtnAdd').css("cursor", "not-allowed");

    //Disabling the inner Update Btn...
    innerFormBtnUpdate.disabled = true;
    $('#innerFormBtnUpdate').css("cursor", "not-allowed");



    //INNER TABLE

    //SETTING DEFAULT VALUE TO THE TOTAL AMOUNT
    let totalAmount = 0.00;

    //create display property list
    let DisplayPropertyList = ['model_id.model_name','unit_price','quantity','line_amount'];

    //create display property list type
    let DisplayPropertyListType = ['object','text','text','text'];

    let innerLoggedUserPrivilage = getServiceRequest("/userprivilage/bymodule?modulename=PRE-ORDER");
    // calling filldataintotable function to fill data
    fillDataIntoTable(tablePreOrderInnerTable,preOrder.preOrderHasModelList,DisplayPropertyList, DisplayPropertyListType, innerFormRefill, innerRowDelete, innerRowView,true,innerLoggedUserPrivilage);


    // Created to invisible the Delete Btn in inner table  and sum all the line_total to total field.
    for (let index in preOrder.preOrderHasModelList){

        tablePreOrderInnerTable.children[1].children[index].children[5].children[2].style.display = "none";

        totalAmount = parseFloat(totalAmount) + parseFloat(preOrder.preOrderHasModelList[index].line_amount)

    }


    // To validate the total amount field with orange and green colour....
    if (totalAmount != 0.00){

        preOrderTotalAmount.value = parseFloat(totalAmount).toFixed(2);
        preOrder.total_amount     = preOrderTotalAmount.value;

        if (oldPreOrder != null && preOrder.total_amount != oldPreOrder.total_amount){

            //update style
            preOrderTotalAmount.style.color = 'orange';


        }else {

            //valid style
            preOrderTotalAmount.style.color = 'green';

        }

    }

}

const selectModelToGetUnitPrice = () => {

    preOrderUnitPrice.value = parseFloat(JSON.parse(preOrderModel.value).sales_price).toFixed(2)
    preOrderHasModel.unit_price = preOrderUnitPrice.value;
    preOrderUnitPrice.style.color = 'green';

}

const multiplyQuantityWithUnitPrice = () => {

    if (preOrderQuantity.value != 0){

        let regPattern = new RegExp("^[0-9]{1,5}$");

        if (regPattern.test(preOrderQuantity.value)){

            preOrderLineTotal.value  = (parseFloat(preOrderUnitPrice.value)*parseFloat(preOrderQuantity.value)).toFixed(2)
            preOrderLineTotal.style.color = 'green';
            preOrderHasModel.line_amount = preOrderLineTotal.value;

            if (oldPreOrderHasModel == null){

                //Enabling the inner Add Btn...
                innerFormBtnAdd.disabled = false;
                $('#innerFormBtnAdd').css("cursor", "pointer");

            }else {

                //Enabling the inner Update Btn...
                innerFormBtnUpdate.disabled = false;
                $('#innerFormBtnUpdate').css("cursor", "pointer");

            }

        }else {

            preOrderQuantity.style.color = 'red';

        }

    }else {

        preOrderQuantity.style.color = 'red';
        preOrderLineTotal.value = "";

    }

}



const innerAddMC = () => {

    let itemExt = false;

    for (let index in preOrder.preOrderHasModelList){

        if (preOrder.preOrderHasModelList[index].model_id.model_name == preOrderHasModel.model_id.model_name){

            itemExt = true;
            break;

        }

    }

    if (!itemExt){

        let submitConfigMsg = "Are you willing to add following Pre-Order Model?\n" +
            "\n Model Name : " + preOrderHasModel.model_id.model_name +
            "\n Unit Price : Rs. " + preOrderHasModel.unit_price +
            "\n Quantity : "   + preOrderHasModel.quantity +
            "\n Line Total : Rs. " + preOrderHasModel.line_amount;

        let userResponse    = window.confirm(submitConfigMsg)

        if (userResponse) {

            preOrder.preOrderHasModelList.push(preOrderHasModel);
            alert("Pre-Order Model Added Successfully as you wish!!!");
            refreshInnerFormAndTable();

        }

    }else {

        alert("Model Cannot be Added : It's already Exist!!!\n" + "\n Model Name : " + preOrderHasModel.model_id.model_name)

    }


}

const innerUpdateMC = () => {

    if (preOrderHasModel.quantity != oldPreOrderHasModel.quantity){

        let submitConfigMsg = "Are you willing to update the following Pre-Order Model?\n" +
            "\n Model Name : " + preOrderHasModel.model_id.model_name +
            "\n Unit Price : Rs. " + preOrderHasModel.unit_price +
            "\n Quantity : "   + preOrderHasModel.quantity +
            "\n Line Total : Rs. " + preOrderHasModel.line_amount;

        let userResponse    = window.confirm(submitConfigMsg)

        if (userResponse) {

            preOrder.preOrderHasModelList[selectedInnerRow] = preOrderHasModel;
            alert("Pre-Order Model Updated Successfully as you wish!!!");
            refreshInnerFormAndTable();

        }


    }else {

        window.alert("Nothing Updated!!!")

    }

}

const innerClearMC = () => {

    refreshInnerFormAndTable();

}

const innerFormRefill = (innerOb, innerRowNo) => {

    selectedInnerRow = innerRowNo;
    preOrderHasModel = JSON.parse(JSON.stringify(innerOb));
    oldPreOrderHasModel = JSON.parse(JSON.stringify(innerOb));

    innerModels = getServiceRequest("/model/list")
    fillSelectFeild2(preOrderModel, "Select Model", innerModels,"model_number" ,"model_name", preOrderHasModel.model_id.model_number)
    preOrderModel.style.color        = "green";
    preOrderModel.style.borderBottom = "solid";
    $('#preOrderModel').css("pointer-events", "none");
    $('#preOrderModel').css("cursor", "not-allowed");


    preOrderUnitPrice.value       = preOrderHasModel.unit_price;
    preOrderUnitPrice.style.color = "green";
    $('#preOrderUnitPrice').css("pointer-events", "none");
    $('#preOrderUnitPrice').css("cursor", "not-allowed");


    preOrderQuantity.value   = preOrderHasModel.quantity;
    preOrderQuantity.style.color = "green";


    preOrderLineTotal.value  = preOrderHasModel.line_amount;
    preOrderLineTotal.style.color = "green";
    $('#preOrderLineTotal').css("pointer-events", "none");
    $('#preOrderLineTotal').css("cursor", "not-allowed");


    //Disabling the inner Add Btn...
    innerFormBtnAdd.disabled = true;
    $('#innerFormBtnAdd').css("cursor", "not-allowed");

}

const innerRowDelete = (innerOb, innerRowIndex) => {

    let deleteMsg = "Would you like to Delete this Pre-Order Model?\n"
        +"Model Name : "+ innerOb.model_id.model_name ;

    let deleteUserResponse = window.confirm(deleteMsg);

    if (deleteUserResponse) {

         preOrder.preOrderHasModelList.splice(innerRowIndex, 1);
         alert("As you wish, Deleted the Pre-Order Successfully !!!");
         refreshInnerFormAndTable();

    }

}

const innerRowView = () => {

}


function checkErrors() {

    let error = "";


    if (preOrder.customer_id == null){

        error = error + "Pre-Order Customer Field Incomplete \n";

    }

    if (preOrder.required_date == null){

        error = error + "Pre-Order Required Date Field Incomplete \n";

    }

    if (preOrder.total_amount == null){

        error = error + "Pre-Order Total Amount Field Incomplete \n";

    }

    if (preOrder.pre_order_status_id == null){

        error = error + "Pre-Order Status Field Incomplete \n";

    }

    if (preOrder.preOrderHasModelList.length == "0"){

        error = error + "Pre-Order Models Not Added \n";

    }


    return error;


}


//CREATED FUNCTION FOR ADD BUTTON...
const submitBtnFunction = () => {

    let errors = checkErrors();

    if ( errors == ""){

        let submitConfigMsg = "Are you willing to add this Pre-Order?\n" +
            "\n Customer Name : " + preOrder.customer_id.fullname +
            "\n Pre-Order Required Date : " + preOrder.required_date +
            "\n Total Amount : Rs. " + preOrder.total_amount;

        let userResponse    = window.confirm(submitConfigMsg)


        if (userResponse) {

            let postServiceResponse = getAjexServiceRequest("/preorder", "POST", preOrder);


            if (postServiceResponse == "0") {

                alert("Pre-Order Added Successfully as you wish!!!");
                refreshTable();
                refreshForm();
                empMancontainer.classList.remove("right-panel-active")

            } else {

                window.confirm("You have these following error\n" + postServiceResponse)

            }
        }

    }else {

        alert("Form has these following errors \n" + errors)

    }

}


const formRefill = (ob) => {

    empMancontainer.classList.add("right-panel-active");

    preOrder    = getAjexServiceRequest("/preorder/getbyid/"+ob.id);
    oldPreOrder = getAjexServiceRequest("/preorder/getbyid/"+ob.id);


    //SET VALUE
    preOrderRequiredDate.value = preOrder.required_date;
    preOrderTotalAmount.value  = preOrder.total_amount;


    fillSelectFeild(preOrderCustomer, "Select Pre-Order Customer", Customers, "fullname", preOrder.customer_id.fullname);
    preOrderCustomer.style.borderBottom   = "solid";

    fillSelectFeild(preOrderStatus, "Select Pre-Order Status", Statuses, "name", preOrder.pre_order_status_id.name);
    preOrderStatus.style.borderBottom   = "solid";

    refreshInnerFormAndTable();

    disableAddUpdateBtn(false, true);

}

const checkUpdate = () => {

    let update = "";

    if (preOrder != null && oldPreOrder != null) {


        if (preOrder.customer_id.id != oldPreOrder.customer_id.id) {
            update = update + "Pre-Order Customer updated \n";
        }

        if ( preOrder.required_date != oldPreOrder.required_date) {
            update = update + "Pre-Order Required Date updated \n";
        }

        if (preOrder.total_amount != oldPreOrder.total_amount) {
            update = update + "Pre-Order Total Amount updated \n";
        }

        if (preOrder.pre_order_status_id.id != oldPreOrder.pre_order_status_id.id) {

            update = update + "Pre-Order Status updated \n";

        }

        if (preOrder.preOrderHasModelList.length != oldPreOrder.preOrderHasModelList.length) {

            update = update + "Pre-Order Models updated" + "\n";

        }else {

           let existUpdate = false;

            for (let i = 0; i < preOrder.preOrderHasModelList.length; i++){

                for (let l = 0; l < oldPreOrder.preOrderHasModelList.length; l++){

                    if (preOrder.preOrderHasModelList[i].model_id.model_number == oldPreOrder.preOrderHasModelList[i].model_id.model_number){

                        if (preOrder.preOrderHasModelList[i].quantity == oldPreOrder.preOrderHasModelList[i].quantity){

                            existUpdate = true;
                            break;

                        }

                    }

                }

            }

            if (existUpdate){

                update = update + "Pre-Order Model quantity updated \n";

            }

        }

    }

    return update;

}

const updateBTN = () => {

    // checking any errors in the form
    let errors = checkErrors();

    if (errors == "") {

        //checking any field is updated, does form has any updated value...
        let update = checkUpdate();
        if (update == ""){  //IF UPDATE IS EMPTY , NO UPDATE AVAILABLE IN THE FORM. BELOW CODE RUNS

            //if update is not available
            window.alert("Nothing Updated...!\n");

        }else {

            // get confirmation from user for updated value if available...
            let updateResponce = window.confirm("Are you willing to update following Pre-Order Details? \n" + update);

            if (updateResponce) {

                //IF USER CLICK OK BTN FOR UPDATE CONFIRMATION.
                let putResponce = getAjexServiceRequest("/preorder","PUT",preOrder);;

                if (putResponce == "0") {

                    //IF THE DATA UPDATED AND STORED SUCCESSFULLY
                    window.alert("Updated the Pre-Order Details successfully as you wish...!");
                    refreshTable();
                    refreshForm();
                    refreshInnerFormAndTable();
                    empMancontainer.classList.remove("right-panel-active");

                }else {

                    //IF THE DATA UPDATED AND STORED IS UNSUCCESSFUL
                    window.alert("Failed to update the Pre-Order Details, Please try Again...!\n" + putResponce);

                }

            }

        }

    }else{

        // if any errors occurred in the form this line will execute...
        window.alert("You have the following errors in your form...! \n" + errors)

    }


}

const rowDelete = (ob) => {

    let deleteMsg = "Would you like to Delete the following Pre-Order?\n"
        +"Pre-Order Code : "+ ob.pre_order_code ;

    let deleteUserResponse = window.confirm(deleteMsg);

    if (deleteUserResponse) {

        let deleteSeverResponse = getAjexServiceRequest("/preorder","DELETE", ob);


        if(deleteSeverResponse == "0"){

            alert("As you wish, Deleted the Pre-Order Successfully !!!");
            refreshTable();

        }else {

            window.confirm("You have the following error\n" + deleteSeverResponse)

        }

    }

}

const rowView = (ob) => {

    modelPrint = getServiceRequest("/model/getbyid/"+ob.id)

    $('#modelModal').modal("show");

    modSubCategory.innerHTML       = modelPrint.sub_catergory_id.name;
    modBrand.innerHTML             = modelPrint.brand_id.name;
    modModelName.innerHTML         = modelPrint.model_name;
    modModelNo.innerHTML           = modelPrint.model_number;
    modSalesPrice.innerHTML        = salesPrice(modelPrint);
    modPurchasePrice.innerHTML     = purchasePrice(modelPrint);
    modProfitRate.innerHTML        = modelPrint.profit_rate + "%";
    modMinDiscountRate.innerHTML   = modelPrint.min_discount_rate + "%";
    modMaxDiscountRate.innerHTML   = modelPrint.max_discount_rate + "%";
    modModelStatus.innerHTML       = modelPrint.model_status_id.name;
    modNote.innerHTML              = modelPrint.note;



}

const clearBtn = () => {

    refreshForm();

}



