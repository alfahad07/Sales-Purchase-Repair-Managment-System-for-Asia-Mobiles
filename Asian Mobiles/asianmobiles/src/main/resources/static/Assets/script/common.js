//CREATED A AJEX CALL FUNCTION...
function getAjexServiceRequest(url,method,data) {

    let responceDate;

    $.ajax( url, {

        async: false,
        contentType: 'application/json',
        data: JSON.stringify(data),
        type:method,
        success: function (data, status, xhr) {
            responceDate = data;
        },
        error: function (rxhrdata,errorstatus,errorMessage) {
            responceDate = [];
        }
    })

    return responceDate;

}

function getServiceRequest(url) {

    let responceDate;

    $.ajax( url, {

        async: false,
        dataType: 'json',
        success: function (data, status, xhr) {
            responceDate = data;
        },
        error: function (rxhrdata,errorstatus,errorMessage) {
            responceDate = [];
        }
    })

    return responceDate;

}

//CREATED TO VALIDATE THE INPUT DATA
const textFeildValidtor =   (feildid, pattern, object, property, oldobject) => {

    let ob = window[object];
    let oldob = window[oldobject];

    if (feildid.value != "") {
        const namepattern = new RegExp(pattern);
        if (namepattern.test(feildid.value)) {
            ob[property] = feildid.value;

            if (oldob != null && ob[property] != oldob[property]) {

                // updated
                feildid.style.color = 'orange'
            } else {

                // valid
                feildid.style.color = 'green'
            }

        } else {
            ob[property] = null;

            feildid.style.color = 'red';
        }

    } else {
        ob[property] = null;
        if (feildid.required) {
            feildid.style.color = 'red';
        } else {
            feildid.style.color = 'rgb(118, 118, 118)';
        }

    }

}


//
const redioFeildValidator = (feildid, pattern, object, property, lblid) => {

    let ob = window[object];
    if (feildid.checked) {
        ob[property] = feildid.value;
        lblid.style.color = 'green';
    } else {
        ob[property] = null;
        lblid.style.color = 'red';
    }
}


// Created to validate or to fix the Active and Inactive for the Switch...
const checkBoxValidator = (feildid, pattern, object, property, oldobject, labelid, trueMsg, falseMsg) => {

    let ob = window[object];
    let oldob = window[oldobject];

    if (feildid.checked) {

        ob[property] = true;

        if (trueMsg != "") {
            labelid.innerText = "";
            labelid.innerText = trueMsg
            if (oldob != null && ob[property] != oldob[property]) {

                labelid.style.color = "orange";

            } else {

                labelid.style.color = "green";

            }

        }

    } else {

        ob[property] = false;

        if (falseMsg != "") {
            labelid.innerText = "";
            labelid.innerText = falseMsg;
            if (oldob != null && ob[property] != oldob[property]) {

                labelid.style.color = "orange";

            } else {

                labelid.style.color = "red";

            }
        }

    }

}

//
const selectValidator = (feildid, pattern, object, property,oldobject) => {

    let ob = window[object];
    let  oldob = window[oldobject];

    if (feildid.value != "") {

        ob[property] = JSON.parse(feildid.value);

        if(oldob != null && ob[property]['id'] != oldob[property]['id']){

            //update style
            feildid.style.color = 'orange';
            feildid.style.borderBottom = '2px solid orange';

        }else {

            //valid style
            feildid.style.color = 'green';
            feildid.style.borderBottom = '2px solid green';

        }

    } else {

        ob[property] = null;

        //invalid style
        feildid.style.color = 'red';
        feildid.style.borderBottom = '2px solid red';

    }
}


const getCurrentDate = (formate, givendate) => {


    //Set Auto Load Value
    let today;

    if(givendate != ""){

        today = new Date(givendate);

    }else {

        today = new Date();

    }

    let month = today.getMonth() + 1; // return (0 - 11) THIS RETURN 12 MONTHS AS (0 MONTH as January TO 11 MONTH as December) TO CHANGE THIS ADDING 1 TO SHOW AS (1 MONTH as January TO 12 MONTH as December)
    let date  = today.getDate();      // return 1st day to 31st day

    if(month < 10) month = "0" + month;
    if(date < 10) date   = "0" + date;


    let currentDate = today.getFullYear() +"-" + month + "-" + date ;
    let currentMonth = today.getFullYear() +"-" + month ;
    let currentYear = today.getFullYear();


    if(formate == "date")return currentDate;
    if(formate == "month")return currentMonth;
    if(formate == "year")return currentYear;


}


const getMontahDate = (dateOb) => {

    let month = dateOb.getMonth() + 1; // return (0 - 11) THIS RETURN 12 MONTHS AS (0 MONTH as January TO 11 MONTH as December) TO CHANGE THIS ADDING 1 TO SHOW AS (1 MONTH as January TO 12 MONTH as December)
    if (month < 10) {month = "0" + month};

    let date = dateOb.getDate() ;
    if (date < 10) {date = "0" + date};

    return "-" + month + "-" + date;
}



// CREATED TO VALIDATE THE DATE
const dateFeildValidtor = (feildid, pattern, object, property, oldobject) => {

    let ob = window[object];
    let oldob = window[oldobject];

    //Data binding for object property
    ob[property] = feildid.value;

    if(oldob != null && ob[property] != oldob[property]){

        //updated
        feildid.style.color = "orange";

    }else{

        //valid
        feildid.style.color = "green";

    }

}


const fillSelectFeild = (feildid, displayMessage, dataList, displayProperty, selectedValue, visibility = false) => {

    feildid.innerHTML = "";

    if(displayMessage != "")
    optionPlaceholder = document.createElement('option');
    optionPlaceholder.value = "";
    optionPlaceholder.selected = true;
    optionPlaceholder.disabled = true;
    optionPlaceholder.innerText = displayMessage;
    feildid.appendChild(optionPlaceholder);

    for (index in dataList) {
        optionValues = document.createElement('option');
        optionValues.value = JSON.stringify(dataList[index]);
        optionValues.innerText = dataList[index][displayProperty];

        if (dataList[index][displayProperty] == selectedValue) {
            optionValues.selected = true;
            feildid.style.color = "green"
        }
        feildid.appendChild(optionValues);

    }


    if (visibility)
        feildid.disabled = true;
    else
        feildid.disabled = false;
}

const fillSelectFeild2 = (feildid, displayMessage, dataList, displayProperty, displayProperty2, selectedValue, visibility = false) => {
    feildid.innerHTML = "";
    optionPlaceholder = document.createElement('option');
    optionPlaceholder.value     = "";
    optionPlaceholder.selected  = true;
    optionPlaceholder.disabled  = true;
    optionPlaceholder.innerText = displayMessage;
    feildid.appendChild(optionPlaceholder);

    for (index in dataList) {
        optionValues = document.createElement('option');
        optionValues.value = JSON.stringify(dataList[index]);
        //  optionValues.innerText = getDataFromObject(dataList[index], displayPropertyList)
        optionValues.innerText = dataList[index][displayProperty] + " -> " + dataList[index][displayProperty2];

        if (dataList[index][displayProperty] == selectedValue) {
            optionValues.selected = true;
            feildid.style.color = "green"
        }

        feildid.appendChild(optionValues);
    }


    if (visibility)
        feildid.disabled = true;
    else
        feildid.disabled = false;
}

const fillSelectFeild3 = (feildid, displayMessage, dataList, displayProperty, displayProperty2, displayProperty21, visibility = false) => {
    optionPlaceholder = document.createElement('option');
    optionPlaceholder.value = "";
    optionPlaceholder.selected = true;
    optionPlaceholder.disabled = true;
    optionPlaceholder.innerText = displayMessage;
    feildid.appendChild(optionPlaceholder);

    for (index in dataList) {
        optionValues = document.createElement('option');
        optionValues.value = JSON.stringify(dataList[index]);
        //  optionValues.innerText = getDataFromObject(dataList[index], displayPropertyList)
        optionValues.innerText = dataList[index][displayProperty2][displayProperty21] + " " + dataList[index][displayProperty];
        feildid.appendChild(optionValues);
    }


    if (visibility)
        feildid.disabled = true;
    else
        feildid.disabled = false;
}

const fillDataIntoTable = (tableid, dataList, propertyList, display_DT, modifyFunction, deleteFunction, viewFunction, buttonvisibility = true) => {

    //
    tbody = tableid.children[1];
    tbody.innerHTML = ""; // To refresh table

    for (index in dataList) {


        // create tr node
        tr = document.createElement("tr");
        //create td node
        tdind = document.createElement("td");
        tdind.innerText = parseInt(index) + 1;
        tr.appendChild(tdind);


        for (pro in propertyList) {
            //create td node
            td = document.createElement("td");
            let data = dataList[index][propertyList[pro]];

            console.log(propertyList[pro]);
            console.log(display_DT[pro]);
            tr.appendChild(td);

            if (display_DT[pro] == 'text') {

                if (data == null) {
                    td.innerText = "-";
                } else {
                    td.innerText = data;
                }
            } else if (display_DT[pro] == 'object') {
                td.innerText = getDataFromObject(dataList[index], propertyList[pro]);

            } else if (display_DT[pro] == 'yearbydate') {

                if (data == null) {
                    td.innerText = "-";
                } else {
                    td.innerText = new Date(data).getFullYear();
                }

            } else if (display_DT[pro] == 'image') {
                let img = document.createElement('img');
                img.classList.add('imgModify') // To resize the image, added a class. Class is written in the head tag of the employee.js html file.
                if (data == null) {
                    img.src = "res/images/lambo.png";
                } else {
                    img.src = data;
                }
                td.appendChild(img);
            } else {
                td.innerText = display_DT[pro](dataList[index]); //calling the function on displayDT to disply the data on the table. 
            }
            tr.appendChild(td);


        }

        //Create td for add modify buttons
        tdB = document.createElement("td");
        tdB.classList.add('modify'); // Modify class added to hide the Modify column/ Buttons while printing the table. Modify class is declared in printTable function in employee.js file.
        tdB.classList.add('text-center');

        //Create buttons by using DOM
        btnEdit = document.createElement("button");
        btnEdit.classList.add('tableBtn');
        btnEdit.classList.add('editBtnColour');
        btnEdit.classList.add('fw-bold');
        spanEdit = document.createElement("span");
        spanEdit.classList.add('btnTitle')
        btnEdit.onclick = function () {
            // alert("edit");
            let indx = this.parentNode.parentNode.firstChild.innerHTML;
            modifyFunction(dataList[parseInt(indx) - 1], parseInt(indx) - 1);
        }

       
        btnDelete = document.createElement("button");
        btnDelete.classList.add('tableBtn');
        btnDelete.classList.add('deleteBtnColour');
        btnDelete.classList.add('fw-bold');
        btnDelete.classList.add('ms-1');
        btnDelete.classList.add('me-1');
        spanDelete = document.createElement("span");
        spanDelete.classList.add('btnTitle')
        spanDelete.classList.add('deleteText')
        btnDelete.onclick = function () {
            //alert("Delete");
            let indx = this.parentNode.parentNode.firstChild.innerHTML;
            deleteFunction(dataList[parseInt(indx) - 1], parseInt(indx) - 1);
        }

        
        btnView = document.createElement("button");
        btnView.classList.add('tableBtn');
        btnView.classList.add('viewBtnColour');
        btnView.classList.add('fw-bold');
        spanView = document.createElement("span");
        spanView.classList.add('btnTitle')
        btnView.onclick = function () {
            // alert("View");
            let indx = this.parentNode.parentNode.firstChild.innerHTML;
            viewFunction(dataList[parseInt(indx) - 1], parseInt(indx) - 1);
        }

         spanEdit.innerHTML = "Edit";
         btnEdit.innerHTML = "<i class='fas fa-edit'></i>";
         btnEdit.appendChild(spanEdit)

         spanDelete.innerHTML= "Delete";
         btnDelete.innerHTML = "<i class='fa-solid fa-trash-can'></i>";
         btnDelete.appendChild(spanDelete)

         spanView.innerHTML="View";
         btnView.innerHTML = "<i style='left: 7px' class='fa-solid fa-eye'></i>";
         btnView.appendChild(spanView);

        tdB.appendChild(btnEdit);
        tdB.appendChild(btnDelete);
        tdB.appendChild(btnView);

        if (buttonvisibility)
            tr.appendChild(tdB);

        tbody.appendChild(tr);

    }
}

function getDataFromObject(obj, path) {
    console.log(obj);
    console.log(path);

    //requring function declaration
    let getData = (modal, proPath) => {
        let paths = proPath.split('.'); // splitting the property 'designation_id.abc.name' by '.'dot

        if (paths.length > 1 && typeof modal[paths[0]] === "object") {

            return getData(modal[paths[0]], paths.slice(1).join('.'));
        } else {
            return modal[paths[0]];
        }
    }

    //requring function calling
    let data = getData(obj, path);
    return data;
}

// Created to clear the colour for selected row in the table...
const clearTableStyle = (tableid) => {
    
    for (let index = 0; index < tableid.children[1].children.length; index++) {

        tableEmployeeD.children[1].children[index].style.backgroundColor = "white";
    
      }

}

function printView() {

    let win = window.open(); //opens a new tab or window
    win.document.write("<link rel='stylesheet' href='Assets/bootstrap/css/bootstrap.min.css'>" + viewTable.outerHTML );

    setTimeout(()=>{  win.print();},1000)

}


function printTable(table_id) {
    let win = window.open();                                                                    //Modify class declaration to hide the modify colomn/buttons
    win.document.write("<link rel='stylesheet' href='Assets/bootstrap/css/bootstrap.min.css'>"+ "<style>.modify{display: none}</style>"+ table_id.outerHTML );
    setTimeout(()=>{  win.print();},1000)
}

//FUNCTION MADE TO MOVE THE OVERLAY PANNEL TO SEE THE FORM AND TABLE
const moveRightAndLeftOverlayPanel = () => {

    const empTableButton = document.getElementById("empTableBtn");
    const empFormButton = document.getElementById("empFormBtn");
    const empMancontainer = document.getElementById("empMancontainer");

    empFormButton.addEventListener("click", () => {
        empMancontainer.classList.add("right-panel-active")
    })

    empTableButton.addEventListener('click', () => {
        empMancontainer.classList.remove("right-panel-active")
    })

}


// EMPLOYE FORM AND TABLE BOX OR CONTAINER 3D ROTATE
const formAndTableContainer3DRotate = () => {

    const container = document.querySelector('.moduleManagementContainer');

    container.addEventListener("mousemove", (e) => {
        let horizontal = (window.innerWidth / 2 - e.pageX) / 200;
        let vertical = (window.innerHeight / 2 - e.pageX) / 200;
        container.style.transform = `rotateX(${horizontal}deg) rotateY(${vertical}deg)`;
    })

    container.addEventListener("mouseenter", (e) => {
        container.style.transition = ".1s";
    })

    container.addEventListener("mouseleave", (e) => {
        container.style.transition = ".1s";
        container.style.transform = "rotateY(0deg) rotateX(0deg)";
    })

}

const nameCapitalLetterCheckValidtor =   (feildid, pattern, object, property, oldobject) => {

    let ob = window[object];
    let oldob = window[oldobject];

    if (feildid.value != "") {

        const namepattern = new RegExp(pattern);

        if (namepattern.test(feildid.value)) {

            name = feildid.value.split(" ");
            console.log(name);

            let fullNameWithUpperCase = "";

            for (let ind in name) {

                fullNameWithUpperCase = fullNameWithUpperCase + name[ind].charAt(0).toUpperCase() + name[ind].substring(1) + " ";
                console.log(fullNameWithUpperCase)

            }

            ob[property] = fullNameWithUpperCase;

            if (oldob != null && ob[property] != oldob[property]) {

                // updated
                feildid.style.color = 'orange'
            } else {

                // valid
                feildid.style.color = 'green'
            }

        } else {
            ob[property] = null;

            feildid.style.color = 'red';
        }

    } else {

        ob[property] = null;

        if (feildid.required) {

            feildid.style.color = 'red';

        } else {

            feildid.style.color = 'rgb(118, 118, 118)';

        }

    }

}