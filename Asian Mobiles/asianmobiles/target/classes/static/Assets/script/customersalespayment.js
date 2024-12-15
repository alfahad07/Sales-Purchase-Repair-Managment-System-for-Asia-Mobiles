window.addEventListener('load', loadUserInterface);

//create function for browser on load event
function loadUserInterface() {

    loggedUserPrivilage = getServiceRequest("/userprivilage/bymodule?modulename=SALES-PAYMENT")

    //CALLED USER FORM AND TABLE BOX OR CONTAINER 3D ROTATE
    formAndTableContainer3DRotate();

    //CALLED USER FORM AND TABLE BOX OR CONTAINER OVERLAYPANEL SLIDER TO SLIDE LEFT AND RIGHT
    moveRightAndLeftOverlayPanel();

    //CALLED REFRESH TABLE FUNCTION
    refreshTable();

    //CALLED REFRESH FORM FUNCTION
    refreshForm();

    //filtering for SalesInvoice to get totalamount
    customerSalesInvoiveNo.addEventListener('change', event => {

        SalesInvoices = JSON.parse(customerSalesInvoiveNo.value);
        totalAmount.value = SalesInvoices.net_amount
        customerPayment.total_amount = (parseFloat(totalAmount.value)).toFixed(2);
        totalAmount.style.color = "green"

    })

}

//create function for refresh  table
const refreshTable = () => {

    //create Array for Payments
    customerPayments = new Array();

    customerPayments = getServiceRequest("/customerpayment/list");

    //create display property list
    let DisplayPropertyList = ['bill_number','sales_invoice_id.bill_number','total_amount','payment_method_id.name','payment_status_id.name'];

    //create display property list type
    let DisplayPropertyListType = ['text','object',"text","object","object"];

    // calling filldataintotable function to fill data
    fillDataIntoTable(tableCustomerPayment, customerPayments, DisplayPropertyList, DisplayPropertyListType, formRefill, rowDelete, rowView, loggedUserPrivilage);

    //Invisibling the Delete Button in the table when the Status is deleted (Once Deleted the Details or row, the Delete Btn will Disappear)
    for (let index in customerPayments) {

        if (customerPayments[index].payment_status_id.name == "Deleted")
              tableCustomerPayment.children[1].children[index].children[6].children[1].style.display = "none";


        tableCustomerPayment.children[1].children[index].children[6].children[0].style.display = "none";

    }

    //need to add jquery table
    $('#tableCustomerPayment').dataTable();

}

const refreshForm = () => {


    customerPayment = new Object();
    oldCustomerPayment = null;

    cusPaymentStatuses = getServiceRequest("/paymentstatus/list")
    fillSelectFeild(customerPaymentStatus, "Select Payment Status", cusPaymentStatuses, "name", "Paid")
    customerPayment.payment_status_id = JSON.parse(customerPaymentStatus.value);

    paymentSalesInvoiceNos = getServiceRequest("/salesinvoice/list")
    fillSelectFeild(customerSalesInvoiveNo, "Select Sales Invoice", paymentSalesInvoiceNos, "bill_number")


    cusPaymentMethod = getServiceRequest("/paymentmethod/listforcustomer")
    fillSelectFeild(paymentType, "Select Payment Type", cusPaymentMethod, "name","Cash")
    customerPayment.payment_method_id = JSON.parse(paymentType.value);



    //CLEARING THE EMPLOYEE DETAILS IN THE ATTRIBUTE FIELDS IN THE FORM AFTER ADDING THE CUSTOMER

    customerPaymentStatus.style.color        = "green";
    customerPaymentStatus.style.borderBottom = "solid";

    customerSalesInvoiveNo.style.color        = "grey";
    customerSalesInvoiveNo.style.borderBottom = "none";

    paymentType.style.color        = "green";
    paymentType.style.borderBottom = "solid";


    totalAmount.value               = "";
    paidAmount.value                = "";
    balanceAmount.value             = "";
    paymentNote.value               = "";


    disableAddUpdateBtn(true);

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

    if (customerPayment.total_amount == null){

        error = error + "Total Amount Field Incomplete \n";

    }

    if (customerPayment.paid_amount == null){

        error = error + "Paid Amount Field Incomplete \n";

    }

    if (customerPayment.balance_amount == null){

        error = error + "Balance Amount Field Incomplete \n";

    }

    if (customerPayment.payment_status_id == null){

        error = error + "Payment Status Field Incomplete \n";

    }

    if (customerPayment.sales_invoice_id == null){

        error = error + "Sales Invoice No Field Incomplete \n";

    }

    if (customerPayment.payment_method_id == null){

        error = error + "Payment Type Field Incomplete \n";

    }

    return error;

}

//CREATED FUNCTION FOR ADD BUTTON...
const submitBtnFunction = () => {

    let errors = checkErrors();

    if ( errors == ""){

        let submitConfigMsg = "Are you willing to add this Customer Payment?";
        let userResponse    = window.confirm(submitConfigMsg)


        if (userResponse) {

            let postServiceResponse = getAjexServiceRequest("/customerpayment", "POST", customerPayment);


            if (postServiceResponse == "0") {

                alert("Customer Payment Added Successfully as you wish!!!");
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

const rowDelete = (customerPaymentOb) => {

    let deleteMsg = "Would you like to Delete the following Customer Payment ?\n"
        +"Customer Payment Bill No : "+ customerPaymentOb.bill_number ;

    let deleteUserResponse = window.confirm(deleteMsg);

    if (deleteUserResponse) {

        let deleteSeverResponse = getAjexServiceRequest("/customerpayment","DELETE", customerPaymentOb);


        if(deleteSeverResponse == "0"){

            window.alert("As you wish, Deleted the Customer Payment Successfully !!!");
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



//SETTING THE BALANCE AMOUNT BY DEDUCTING THE PAID AMOUNT FROM THE TOTAL AMOUNT...
const balanceCalculation = () => {

    balanceAmount.value = (parseFloat(paidAmount.value) - parseFloat(totalAmount.value)).toFixed(2);
    customerPayment.balance_amount = (JSON.parse(balanceAmount.value)).toFixed(2);
    balanceAmount.style.color = 'green';

}



