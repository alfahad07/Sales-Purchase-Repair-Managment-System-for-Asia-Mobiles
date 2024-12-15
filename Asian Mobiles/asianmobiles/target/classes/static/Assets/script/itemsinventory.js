
window.addEventListener('load', loadUserInterface);

//create function for browser on load event
function loadUserInterface() {

    loggedUserPrivilage = getServiceRequest("/userprivilage/bymodule?modulename=ITEMS")

    //CALLED USER FORM AND TABLE BOX OR CONTAINER 3D ROTATE
    formAndTableContainer3DRotate();

    //CALLED REFRESH TABLE FUNCTION
    refreshTable();

}

//create function for refresh  table
const refreshTable = () => {

    //create Array for employees
    itemsInventories = new Array();

    itemsInventories = getServiceRequest("/itemsinventory/findall");

    //create display property list
    let DisplayPropertyList = ['item_name','id'];

    //create display property list type
    let DisplayPropertyListType = ['text','text'];

    // calling filldataintotable function to fill data
    fillDataIntoTable(tableItemsInventory, itemsInventories, DisplayPropertyList, DisplayPropertyListType, formRefill, rowDelete, rowView, loggedUserPrivilage);

    //Removing the Delete, Edit and View Button in the table
    for (let index in itemsInventories){

        tableItemsInventory.children[1].children[index].children[3].remove();

    }

    //need to add jquery table
    $('#tableItemsInventory').dataTable();

}
const formRefill = () => {

}

const rowDelete = () => {

}

const rowView = () => {

}