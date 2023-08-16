
window.addEventListener('load', loadUserInterface);

//create function for browser on load event
function loadUserInterface() {

    loggedUserPrivilage = getServiceRequest("/userprivilage/bymodule?modulename=MODEL")

    //CALLED USER FORM AND TABLE BOX OR CONTAINER 3D ROTATE
    formAndTableContainer3DRotate();

    //CALLED USER FORM AND TABLE BOX OR CONTAINER OVERLAYPANEL SLIDER TO SLIDE LEFT AND RIGHT
    moveRightAndLeftOverlayPanel();

    //CALLED REFRESH TABLE FUNCTION
    refreshTable();

    //CALLED REFRESH FORM FUNCTION
    refreshForm();

    //FILLTERING FOR modelCategory, modelSubCategory, modelBrand, phoneSeries
    modelCategory.addEventListener('change', event => {

        subCategoriesByCategory = getServiceRequest("/subcategory/listbycategory?cid=" + JSON.parse(modelCategory.value).id)
        fillSelectFeild(modelSubCategory, "Select Sub-Category", subCategoriesByCategory, "name", "")

        brandsByCategory = getServiceRequest("/brand/listbycategory/" + JSON.parse(modelCategory.value).id)
        fillSelectFeild(modelBrand, "Select Brand", brandsByCategory, "name", "")


        if (oldModel != null && JSON.parse(modelCategory.value).name != oldModel.sub_catergory_id.catergory_id.name){

            modelCategory.style.color = "orange"
            modelCategory.style.borderBottom = "2px solid orange"

        }else {

            modelCategory.style.color = "green"
            modelCategory.style.borderBottom = "2px solid green"

        }

        if (JSON.parse(modelCategory.value).id == "1"){

            labelPhoneModel.style.color = "#2196f3";
            phoneModel.style.color      = "grey";
            phoneModel.disabled         = false;
            $('#phoneModel').css("cursor", "pointer");

            labelModelCapacity.style.color    = "#2196f3";
            modelCapacity.style.color         = "grey";
            modelCapacity.disabled            = false;
            $('#modelCapacity').css("cursor", "pointer");

            labelPhoneSeries.style.color    = "#2196f3";
            phoneSeries.style.color         = "grey";
            phoneSeries.disabled            = false;
            $('#phoneSeries').css("cursor", "pointer");


        }else {

            modelSubCategory.value       = "";
            modelSubCategory.style.color = "grey";
            modelSubCategory.style.borderBottom= "none"

            modelBrand.value             = "";
            modelBrand.style.color       = "grey";
            modelBrand.style.borderBottom= "none"

            phoneSeries.value               = "";
            phoneSeries.style.color         = "grey";
            phoneSeries.style.borderBottom  = "none"
            labelPhoneSeries.style.color  = "grey";
            phoneSeries.disabled            = true;
            $('#phoneSeries').css("cursor", "not-allowed");

            modelCapacity.value             = "";
            modelCapacity.style.color       = "grey";
            modelCapacity.style.borderBottom= "none";
            labelModelCapacity.style.color    = "grey";
            modelCapacity.disabled          = true;
            $('#modelCapacity').css("cursor", "not-allowed");

            modelName.value              = "";

            phoneModel.value             = "";
            phoneModel.style.color       = "grey";
            phoneModel.style.borderBottom= "none"
            labelPhoneModel.style.color  = "grey";
            phoneModel.disabled          = true;
            $('#phoneModel').css("cursor", "not-allowed");

        }

    })

    modelSubCategory.addEventListener('change', event => {

        brandsBySubCategory = getServiceRequest("/brand/listbysubcategory/" + JSON.parse(modelSubCategory.value).id)
        fillSelectFeild(modelBrand, "Select Brand", brandsBySubCategory, "name", "")

    })

    modelBrand.addEventListener('change', event => {

        phoneSeriesByBrand = getServiceRequest("/phoneseries/listbybrand/" + JSON.parse(modelBrand.value).id)
        fillSelectFeild(phoneSeries, "Select Phone Series", phoneSeriesByBrand, "name", "")

    })

    phoneSeries.addEventListener('change', event => {

        phoneModelByPhoneSeries = getServiceRequest("/phonemodel/listbyphoneseries/" + JSON.parse(phoneSeries.value).id)
        fillSelectFeild(phoneModel, "Select Phone Model", phoneModelByPhoneSeries, "name", "")

        if (oldModel != null && JSON.parse(phoneSeries.value).name != oldModel.phone_model_name_id.phone_series_id.name){

            phoneSeries.style.color = "orange"
            phoneSeries.style.borderBottom = "2px solid orange"

        }else {

            phoneSeries.style.color = "green"
            phoneSeries.style.borderBottom = "2px solid green"

        }

    })

}


//create function for refresh  table
const refreshTable = () => {

    //create Array for employees
    models = new Array();

    models = getServiceRequest("/model/findall");

    //create display property list
    let DisplayPropertyList = ['sub_catergory_id.name','model_name','model_number','sales_price','purchaase_price','model_status_id.name'];

    //create display property list type
    let DisplayPropertyListType = ['object','text','text',salesPrice,purchasePrice,'object'];

    // calling filldataintotable function to fill data
    fillDataIntoTable(tableModel, models, DisplayPropertyList, DisplayPropertyListType, formRefill, rowDelete, rowView, loggedUserPrivilage);

    //Invisibling the Delete Button in the table when the Status is deleted (Once Deleted the Details or row, the Delete Btn will Disappear)
    for (let index in models){

        if(models[index].model_status_id.name == "Deleted")
            tableModel.children[1].children[index].children[7].children[1].style.display = "none";

    }

    //need to add jquery table
    $('#tableModel').dataTable();

}

const salesPrice = (modOb) => {

    return "Rs." + parseFloat(modOb.sales_price).toFixed(2);

}

const purchasePrice = (modOb) => {

    return "Rs." + parseFloat(modOb.purchase_price).toFixed(2);

}

const refreshForm = () => {


    model = new Object();
    oldModel = null;


    category = getServiceRequest("/category/list")
    fillSelectFeild(modelCategory, "Select Category", category, "name", "")

    subCategory = getServiceRequest("/subcategory/list")
    fillSelectFeild(modelSubCategory, "Select Sub-Category", subCategory, "name", "")

    brands = getServiceRequest("/brand/list")
    fillSelectFeild(modelBrand, "Select Brand", brands, "name", "")

    phoneModels = getServiceRequest("/phonemodel/list")
    fillSelectFeild(phoneModel, "Select Phone Model", phoneModels, "name", "")

    capacities = getServiceRequest("/capacity/list")
    fillSelectFeild(modelCapacity, "Select Capacity", capacities, "name", "")

    Series = getServiceRequest("/phoneseries/list")
    fillSelectFeild(phoneSeries, "Select Phone Series", Series, "name", "")

    modelStatuses = getServiceRequest("/modelstatus/list")
    fillSelectFeild(modelStatus, "Select Model Status", modelStatuses, "name", "")



    //CLEARING THE MODEL DETAILS IN THE ATTRIBUTE FIELDS IN THE FORM AFTER ADDING THE MODELS

    modelCategory.style.color        = "grey";
    modelCategory.style.borderBottom = "none";

    modelSubCategory.style.color        = "grey";
    modelSubCategory.style.borderBottom = "none";

    modelBrand.style.color        = "grey";
    modelBrand.style.borderBottom = "none";

    labelPhoneModel.style.color   = "#2196f3";
    phoneModel.style.color        = "grey";
    phoneModel.style.borderBottom = "none";

    labelModelCapacity.style.color   = "#2196f3";
    modelCapacity.style.color        = "grey";
    modelCapacity.style.borderBottom = "none";

    modelStatus.style.color        = "grey";
    modelStatus.style.borderBottom = "none";

    labelPhoneSeries.style.color   = "#2196f3";
    phoneSeries.style.color        = "grey";
    phoneSeries.style.borderBottom = "none";


    modelName.value            = "";
    modelNumber.value          = "";
    modelSalesPrice.value      = "";
    modelPurchasePrice.value   = "";
    modelProfitRate.value      = "";
    modelMinimumDiscount.value = "";
    modelMaximumDiscount.value = "";
    modelNote.value            = "";



    $('#phoneSeries').css("cursor", "pointer");
    $('#phoneModel').css("cursor", "pointer");
    $('#modelCapacity').css("cursor", "pointer");


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


const generateModelName = () => {

    if ( modelBrand.value != "" && phoneModel.value != "" && modelCapacity.value != "" ){

        modelName.value = JSON.parse(modelBrand.value).name + " " + JSON.parse(phoneModel.value).name + " " + JSON.parse(modelCapacity.value).name;
        model.model_name = modelName.value;

        if (oldModel != null && model.model_name != oldModel.model_name){

            modelName.style.color = "orange";

        }else{

            modelName.style.color = "green";

        }

    }else {

        modelName.value = "";
        model.model_name = null;

    }

}


function checkErrors() {

    let error = "";


    if (modelCategory.value == ""){

        error = error + "Model Category Field Incomplete \n";

    }else {

        if(JSON.parse(modelCategory.value).id == "1"){

            if (phoneSeries.value == ""){

                error = error + "Model Phone Series Field Incomplete \n";

            }

            if (model.phone_model_name_id == null){

                error = error + "Phone Model Field Incomplete \n";

            }

            if (model.capacity_id == null){

                error = error + "Model Capacity Field Incomplete \n";

            }

        }


    }


    if (model.sub_catergory_id == null){

        error = error + "Model Sub-Category Field Incomplete \n";

    }

    if (model.brand_id == null){

        error = error + "Model Brand Field Incomplete \n";

    }

    if (model.model_name == null){

        error = error + "Model Name Field Incomplete \n";

    }

    if (model.model_number == null){

        error = error + "Model Number Field Incomplete \n";

    }

    if (model.sales_price == null){

        error = error + "Model Sales Price Field Incomplete \n";

    }

    if (model.purchase_price == null){

        error = error + "Model Purchase Price Field Incomplete \n";

    }

    if (model.model_status_id == null){

        error = error + "Model Status Field Incomplete \n";

    }

    if (model.profit_rate == null){

        error = error + "Model Profit Rate Field Incomplete \n";

    }

    if (model.min_discount_rate == null){

        error = error + "Model Minimum Discount Field Incomplete \n";

    }

    if (model.max_discount_rate == null){

        error = error + "Model Maximum Discount Field Incomplete \n";

    }


    return error;


}


//CREATED FUNCTION FOR ADD BUTTON...
const submitBtnFunction = () => {

    let errors = checkErrors();

    if ( errors == ""){

        let submitConfigMsg = "Are you willing to add this Model?";
        let userResponse    = window.confirm(submitConfigMsg)


        if (userResponse) {

            let postServiceResponse = getAjexServiceRequest("/model", "POST", model);


            if (postServiceResponse == "0") {

                alert("Model Added Successfully as you wish!!!");
                refreshTable();
                refreshForm();

            } else {

                window.confirm("You have these following error\n" + postServiceResponse)

            }
        }

    }else {

        alert("Form has these following errors \n" + errors)

    }

    empMancontainer.classList.remove("right-panel-active");

}


const formRefill = (ob) => {

    empMancontainer.classList.add("right-panel-active");


    model    = getAjexServiceRequest("/model/getbyid/"+ob.id);
    oldModel = getAjexServiceRequest("/model/getbyid/"+ob.id);


    //SET VALUE
    modelName.value            = model.model_name;
    modelNumber.value          = model.model_number;
    modelSalesPrice.value      = model.sales_price;
    modelPurchasePrice.value   = model.purchase_price;
    modelProfitRate.value      = model.profit_rate;
    modelMinimumDiscount.value = model.min_discount_rate;
    modelMaximumDiscount.value = model.max_discount_rate;
    modelNote.value            = model.note;


    fillSelectFeild(modelCategory, "Select Category", category, "name", model.sub_catergory_id.category_id.name)
    modelCategory.style.borderBottom   = "solid";

    fillSelectFeild(modelSubCategory, "Select Sub-Category", subCategory, "name", model.sub_catergory_id.name)
    modelSubCategory.style.borderBottom   = "solid";

    fillSelectFeild(modelBrand, "Select Brand", brands, "name", model.brand_id.name)
    modelBrand.style.borderBottom   = "solid";


    if (modelCategory.value != ""){


        if(JSON.parse(modelCategory.value).id == "1"){

            fillSelectFeild(phoneSeries, "Select Phone Series", Series, "name", model.phone_model_name_id.phone_series_id.name)
            phoneSeries.style.borderBottom   = "solid";

            fillSelectFeild(phoneModel, "Select Phone Model", phoneModels, "name", model.phone_model_name_id.name)
            phoneModel.style.borderBottom   = "solid";

            fillSelectFeild(modelCapacity, "Select Capacity", capacities, "name", model.capacity_id.name)
            modelCapacity.style.borderBottom   = "solid";

            labelPhoneModel.style.color = "#2196f3";
            phoneModel.style.color      = "";
            phoneModel.disabled         = false;
            $('#phoneModel').css("cursor", "pointer");

            labelModelCapacity.style.color    = "#2196f3";
            modelCapacity.style.color         = "grey";
            modelCapacity.disabled            = false;
            $('#modelCapacity').css("cursor", "pointer");

            labelPhoneSeries.style.color    = "#2196f3";
            phoneSeries.style.color         = "";
            phoneSeries.disabled            = false;
            $('#phoneSeries').css("cursor", "pointer");

        }else {

            phoneSeries.value               = "";
            phoneSeries.style.color         = "grey";
            phoneSeries.style.borderBottom  = "none"
            labelPhoneSeries.style.color  = "grey";
            phoneSeries.disabled            = true;
            $('#phoneSeries').css("cursor", "not-allowed");

            modelCapacity.value             = "";
            modelCapacity.style.color       = "grey";
            modelCapacity.style.borderBottom= "none";
            labelModelCapacity.style.color    = "grey";
            modelCapacity.disabled          = true;
            $('#modelCapacity').css("cursor", "not-allowed");


            phoneModel.value             = "";
            phoneModel.style.color       = "grey";
            phoneModel.style.borderBottom= "none"
            labelPhoneModel.style.color  = "grey";
            phoneModel.disabled          = true;
            $('#phoneModel').css("cursor", "not-allowed");

        }


    }

    fillSelectFeild(modelStatus, "Select Model Status", modelStatuses, "name", model.model_status_id.name)
    modelStatus.style.borderBottom   = "solid";



    disableAddUpdateBtn(false, true);

}

const checkUpdate = () => {

    let update = "";

    if (model != null && oldModel != null) {


        if ( JSON.parse(modelCategory.value).id != oldModel.sub_catergory_id.category_id.id) {
            update = update + "Model Category updated \n";
        }else {

            if (JSON.parse(modelCategory.value).id == "1") {

                if (JSON.parse(phoneSeries.value).id != oldModel.phone_model_name_id.phone_series_id.id) {
                    update = update + "Model Phone Series updated \n";
                }

                if (model.phone_model_name_id.id!= oldModel.phone_model_name_id.id) {
                    update = update + "Phone Model updated \n";
                }

                if (model.capacity_id.id!= oldModel.capacity_id.id) {
                    update = update + "Model Capacity Category updated \n";
                }

            }
        }

        if (model.sub_catergory_id.id!= oldModel.sub_catergory_id.id) {
            update = update + "Model Sub-Category updated \n";
        }

        if (model.brand_id.id != oldModel.brand_id.id) {
            update = update + "Model Brand updated \n";
        }

        if ( model.model_name != oldModel.model_name) {
            update = update + "Model Name updated \n";
        }

        if (model.model_number != oldModel.model_number) {
            update = update + "Model Number updated \n";
        }

         if (model.sales_price != oldModel.sales_price) {
            update = update + "Model Sales Price updated \n";
        }

        if (model.purchase_price != oldModel.purchase_price) {
            update = update + "Model Purchase Price updated \n";
        }

        if (model.model_status_id.name != oldModel.model_status_id.name) {
            update = update + "Model Status updated \n";
        }

        if (model.profit_rate != oldModel.profit_rate) {
            update = update + "Model Profit Rate updated \n";
        }

        if (model.min_discount_rate != oldModel.min_discount_rate) {
            update = update + "Model Minimum Discount updated \n";
        }

        if (model.max_discount_rate != oldModel.max_discount_rate) {
            update = update + "Model Maximum Discount updated \n";
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
            let updateResponce = window.confirm("Are you willing to update following Model? \n" + update);

            if (updateResponce) {

                //IF USER CLICK OK BTN FOR UPDATE CONFIRMATION.
                let putResponce = getAjexServiceRequest("/model","PUT",model);;

                if (putResponce == "0") {

                    //IF THE DATA UPDATED AND STORED SUCCESSFULLY
                    window.alert("Updated the Model successfully as you wish...!");
                    refreshTable();
                    refreshForm();

                }else {

                    //IF THE DATA UPDATED AND STORED IS UNSUCCESSFUL
                    window.alert("Failed to update the Model, Please try Again...!\n" + putResponce);

                }

            }

        }

    }else{

        // if any errors occurred in the form this line will execute...
        window.alert("You have the following errors in your form...! \n" + errors)

    }

    empMancontainer.classList.remove("right-panel-active");

}

const rowDelete = (modelOb) => {

    let deleteMsg = "Would you like to Delete the following Model?\n"
        +"Model Name : "+ modelOb.model_name ;

    let deleteUserResponse = window.confirm(deleteMsg);

    if (deleteUserResponse) {

        let deleteSeverResponse = getAjexServiceRequest("/model","DELETE", modelOb);


        if(deleteSeverResponse == "0"){

            alert("As you wish, Deleted the Model Successfully !!!");
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



