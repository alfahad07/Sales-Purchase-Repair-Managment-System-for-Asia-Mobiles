window.addEventListener('load', loadUserInterface);

//create function for browser on load event
function loadUserInterface() {

    loggedUserPrivilage = getServiceRequest("/userprivilage/bymodule?modulename=PURCHASE-PAYMENT")

    //CALLED USER FORM AND TABLE BOX OR CONTAINER 3D ROTATE
    formAndTableContainer3DRotate();

    //CALLED USER FORM AND TABLE BOX OR CONTAINER OVERLAYPANEL SLIDER TO SLIDE LEFT AND RIGHT
    moveRightAndLeftOverlayPanel();

    //CALLED REFRESH TABLE FUNCTION
    refreshTable();

    //CALLED REFRESH FORM FUNCTION
    refreshForm();

    //filtering for model by quotation
    supplierName.addEventListener('change', event => {

        grnBySupplier = getServiceRequest("/goodsreceivenote/getgrncodebysupplier/" + JSON.parse(supplierName.value).id)
        fillSelectFeild(supplierGrnNo, "Select GRN No", grnBySupplier, "grn_code")

        if (oldSupplierPayment != null && JSON.parse(supplierName.value).id != oldSupplierPayment.supplier_id.id){

            supplierName.style.color = "orange"
            supplierName.style.borderBottom = "2px solid orange"

        }else {

            supplierName.style.color = "green"
            supplierName.style.borderBottom = "2px solid green"

        }

        supplierBankDetails = getServiceRequest("/supplier/getbysupplierId/" + JSON.parse(supplierName.value).id)
        SuppplierBanks = getServiceRequest("/bank/list")
        fillSelectFeild(bankName, "Select Bank", SuppplierBanks, "name", supplierBankDetails.bank_id.name)
        supplierBankBranch.value = supplierBankDetails.bank_branch_name;
        supplierBankAccount.value = supplierBankDetails.bank_account_number;
        supplierBankAccHolderName.value = supplierBankDetails.account_holder_name;
        arreasAmount.value = supplierBankDetails.arreas_amount;

        supplierPayment.bank_branch_name = supplierBankBranch.value;
        supplierPayment.bank_account_number = supplierBankAccount.value;
        supplierPayment.account_holder_name = supplierBankAccHolderName.value;
        supplierPayment.arreas_amount = (parseFloat(arreasAmount.value)).toFixed(2);

        bankName.style.color = "green"
        bankName.style.borderBottom = "2px solid green"

        supplierBankBranch.style.color = "green"
        supplierBankAccount.style.color = "green"
        supplierBankAccHolderName.style.color = "green"
        arreasAmount.style.color = "green"

    })

    supplierGrnNo.addEventListener('change', event => {

        grnBySupplier = getServiceRequest("/goodsreceivenote/getgrnnettotalbygrn/" + JSON.parse(supplierGrnNo.value).id)
        netAmount = grnBySupplier.net_total_amount
        totalAmount.value = (parseFloat(netAmount + parseFloat(arreasAmount.value))).toFixed();
        supplierPayment.total_amount = (parseFloat(totalAmount.value)).toFixed(2);
        totalAmount.style.color = "green"

    })

}

//create function for refresh  table
const refreshTable = () => {

    //create Array for employees
    supplierPayments = new Array();

    supplierPayments = getServiceRequest("/supplierpayment/list");

    //create display property list
    let DisplayPropertyList = ['bill_number','supplier_id.supplier_company_name','goods_recieve_note_id.grn_code','total_amount','payment_method_id.name','payment_status_id.name'];

    //create display property list type
    let DisplayPropertyListType = ['text','object',"object","text","object","object"];

    // calling filldataintotable function to fill data
    fillDataIntoTable(tableSupplierPayment, supplierPayments, DisplayPropertyList, DisplayPropertyListType, formRefill, rowDelete, rowView, loggedUserPrivilage);

    //Invisibling the Delete Button in the table when the Status is deleted (Once Deleted the Details or row, the Delete Btn will Disappear)
    for (let index in supplierPayments){

        tableSupplierPayment.children[1].children[index].children[7].children[1].style.display = "none";
        tableSupplierPayment.children[1].children[index].children[7].children[0].style.display = "none";

    }

    //need to add jquery table
    $('#tableSupplierPayment').dataTable();

}

const refreshForm = () => {


    supplierPayment = new Object();
    oldSupplierPayment = null;

    supPaymentStatuses = getServiceRequest("/paymentstatus/list")
    fillSelectFeild(supplierPaymentStatus, "Select Payment Status", supPaymentStatuses, "name", "Paid")
    supplierPayment.payment_status_id = JSON.parse(supplierPaymentStatus.value);

    paymentSuppliers = getServiceRequest("/supplier/listbyactivesupplierstatus")
    fillSelectFeild(supplierName, "Select Supplier", paymentSuppliers, "supplier_company_name")

    paymentGrn = getServiceRequest("/goodsreceivenote/list")
    fillSelectFeild(supplierGrnNo, "Select GRN Code", paymentGrn, "grn_code")

    SuppplierBanks = getServiceRequest("/bank/list")
    fillSelectFeild(bankName, "Select Bank", SuppplierBanks, "name")

    SupPaymentMethod = getServiceRequest("/paymentmethod/listforsupplier")
    fillSelectFeild(paymentType, "Select Payment Type", SupPaymentMethod, "name","Cash")
    supplierPayment.payment_method_id = JSON.parse(paymentType.value);



    //CLEARING THE EMPLOYEE DETAILS IN THE ATTRIBUTE FIELDS IN THE FORM AFTER ADDING THE CUSTOMER

    supplierPaymentStatus.style.color        = "green";
    supplierPaymentStatus.style.borderBottom = "solid";

    supplierName.style.color        = "grey";
    supplierName.style.borderBottom = "none";

    supplierGrnNo.style.color        = "grey";
    supplierGrnNo.style.borderBottom = "none";

    bankName.style.color        = "grey";
    bankName.style.borderBottom = "none";

    paymentType.style.color        = "green";
    paymentType.style.borderBottom = "solid";

    arreasAmount.value              = "";
    totalAmount.value               = "";
    paidAmount.value                = "";
    balanceAmount.value             = "";
    supplierBankBranch.value        = "";
    supplierBankAccount.value       = "";
    supplierBankAccHolderName.value = "";
    supplierDepositDate.value       = "";
    supplierChequeDate.value        = "";
    supplierChequeNo.value          = "";
    paymentNote.value               = "";


    disableAddUpdateBtn(true, false);

}

const disableAddUpdateBtn = (addBtn) => {


    if( addBtn && loggedUserPrivilage.ins ){

        btnAdd.disabled = false;
        $('#btnAdd').css("pointer-events", "all");
        $('#btnAdd').css("cursor", "pointer");


    }else {

        btnAdd.disabled = true;
        $('#btnAdd').css("pointer-events", "all");
        $('#btnAdd').css("cursor", "not-allowed");

    }

}


function checkErrors() {

    let error = "";


    if (supplierPayment.arreas_amount == null){

        error = error + "Arreas Amount Field Incomplete \n";

    }

    if (supplierPayment.total_amount == null){

        error = error + "Total Amount Field Incomplete \n";

    }

    if (supplierPayment.paid_amount == null){

        error = error + "Paid Amount Field Incomplete \n";

    }

    if (supplierPayment.balance_amount == null){

        error = error + "Balance Amount Field Incomplete \n";

    }
    //if payment type is Bank Payment then check these fields
    if ( JSON.parse(paymentType.value).name == "Bank Payment" ){

        if (supplierPayment.bank_id == ""){

            error = error + "Bank Name Field Incomplete \n";

        }

        if (supplierPayment.bank_branch_name == null){

            error = error + "Bank Branch Field Incomplete \n";

        }

        if (supplierPayment.bank_account_number == null){

            error = error + "Bank Account Field Incomplete \n";

        }

        if (supplierPayment.account_holder_name == null){

            error = error + "Bank Account Holder Name Field Incomplete \n";

        }

        if (supplierPayment.deposite_or_transfered_datetime == null){

            error = error + "Deposit Date Field Incomplete \n";

        }

    }
    //if payment type is cheque then check these fields
    if ( JSON.parse(paymentType.value).name == "Cheque" ){

        if (supplierPayment.cheque_date == null){

            error = error + "Cheque Date Field Incomplete \n";

        }

        if (supplierPayment.cheque_number == null){

            error = error + "Cheque Number Field Incomplete \n";

        }

    }

    if (supplierPayment.payment_status_id == null){

        error = error + "Payment Status Field Incomplete \n";

    }

    if (supplierPayment.supplier_id == null){

        error = error + "Supplier name Field Incomplete \n";

    }

    if (supplierPayment.goods_recieve_note_id == null){

        error = error + "GRN Code No Field Incomplete \n";

    }

    if (supplierPayment.payment_method_id == null){

        error = error + "Payment Type Field Incomplete \n";

    }

    return error;

}

//CREATED FUNCTION FOR ADD BUTTON...
const submitBtnFunction = () => {

    let errors = checkErrors();

    if (errors == ""){

        let submitConfigMsg = "Are you willing to add this Supplier Payment?";
        let userResponse    = window.confirm(submitConfigMsg)


        if (userResponse) {

            let postServiceResponse = getAjexServiceRequest("/supplierpayment", "POST", supplierPayment);


            if (postServiceResponse == "0") {

                alert("Supplier Payment Added Successfully as you wish!!!");
                refreshTable();
                refreshForm();
                empMancontainer.classList.remove("right-panel-active");

            } else {

                window.confirm("You have these following error\n" + postServiceResponse)

            }
        }

    }else {

        window.alert("Form has these following errors \n" + errors)

    }

}

const formRefill = () => {

}

const rowDelete = (supplierPaymentOb) => {

    let deleteMsg = "Would you like to Delete the following Supplier Payment ?\n"
        +"Supplier Payment Bill No : "+ supplierPaymentOb.bill_number ;

    let deleteUserResponse = window.confirm(deleteMsg);

    if (deleteUserResponse) {

        let deleteSeverResponse = getAjexServiceRequest("/supplierpayment","DELETE", supplierPaymentOb);


        if(deleteSeverResponse == "0"){

            alert("As you wish, Deleted the Supplier Payment Successfully !!!");
            refreshTable();

        }else {

            window.confirm("You have the following error\n" + deleteSeverResponse)

        }

    }

}

const rowView = (ob) => {

    supplierPaymentObjects = getServiceRequest("/supplierpayment/getbyid/"+ob.id)

    $('#supplierPaymentModal').modal("show");

    modSupplierName.innerHTML   = supplierPaymentObjects.supplier_id.supplier_company_name;
    modGrnNo.innerHTML          = supplierPaymentObjects.goods_recieve_note_id.grn_code;
    modArreasAmount.innerHTML   = supplierPaymentObjects.arreas_amount;
    modTotalAmount.innerHTML    = supplierPaymentObjects.total_amount;
    modPaidAmount.innerHTML     = supplierPaymentObjects.paid_amount;
    modBalanceAmount.innerHTML  = supplierPaymentObjects.balance_amount;
    modPaymentType.innerHTML    = supplierPaymentObjects.payment_method_id.name;

}

const clearBtn = () => {

    refreshForm();

}

const visibleChequeDetailsFields = () => {

    let bankDetailsDiv = document.getElementById("chequeDetails");
    let supplierPaymentTypeInput = document.getElementById("paymentType");

    if (JSON.parse(supplierPaymentTypeInput.value).name == "Cheque"){

        chequeDateDiv.style.display = "block";
        chequeNoDiv.style.display = "block";

    }else {

        chequeDateDiv.style.display = "none";
        chequeNoDiv.style.display = "none";
    }

}

const visibleBankdetailsFields = () => {

    let bankDetailsDiv = document.getElementById("bankDetails");
    let supplierPaymentInput = document.getElementById("paymentType");

    if (JSON.parse(supplierPaymentInput.value).name == "Bank Payment"){

        bankNameDiv.style.display = "block"
        bankBranchDiv.style.display = "block";
        bankAccountDiv.style.display = "block"
        bankAccHolderNameDiv.style.display = "block"
        depositDateDiv.style.display = "block"

    }else {

        bankNameDiv.style.display = "none";
        bankBranchDiv.style.display = "none";
        bankAccountDiv.style.display = "none";
        bankAccHolderNameDiv.style.display = "none";
        depositDateDiv.style.display = "none";

    }

}

//SETTING THE BALANCE AMOUNT BY DEDUCTING THE PAID AMOUNT FROM THE TOTAL AMOUNT...
const balanceCalculation = () => {

    balanceAmount.value = (parseFloat(totalAmount.value) - parseFloat(paidAmount.value)).toFixed(2);
    supplierPayment.balance_amount = parseFloat(balanceAmount.value).toFixed(2);
    balanceAmount.style.color = 'green';


}



