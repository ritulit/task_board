var taskList=[];
var newTaskDescription;
var newTaskTime;
var errors = [
"A description must be added",
"Date input is wrong. must be in format: dd/mm/yyyy",
"The time you inserted is in the past. please insert future time."
]


function isValidDate(inputDate){
	var reg = new RegExp(/^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g);
	var result = reg.test(inputDate);
	if (result!==true){
	return false;}
	
	return true;
}

function isDateRangeValid(inputDate) {
  
    var decomposed = inputDate.split("/");
    var dueDate  = new Date(decomposed[2], decomposed[1]-1, decomposed[0]);
	var minDate = new Date();
	if(dueDate <= minDate){	
	return false;	
		
	}
	
    return true;	
} 

function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}

function addTaskToStorage( t_description, t_time){
	
	   var t_id = localStorage.getItem("t_id");
	   if (t_id==null){
		   t_id= 0*1;
		   localStorage.setItem("t_id", t_id);
		   var t_id = localStorage.getItem("t_id");
		   
	   }
       var taskObj = {id: t_id, description: t_description, time: t_time};
	   taskList = JSON.parse(localStorage.getItem("my_task_list"));
	   if (taskList ==null ){taskList =[];};
	   taskList.push(taskObj);
	   localStorage.setItem("my_task_list", JSON.stringify(taskList));
	   localStorage.setItem("t_id", parseInt(t_id)+1);
	   
	   return taskObj.id;
		
	
}

function addSingleNoteElementOnPage(t_id){
	var storedList = JSON.parse(localStorage.getItem("my_task_list"));
	notesContainer = document.getElementById("notes_container");
	
	singleNoteContainer = document.createElement("div");
	singleNoteContainer.className= "single_note_container";
	singleNoteContainer.id = "single_note_container-"+t_id;
	notesContainer.appendChild(singleNoteContainer);
	
	singleNoteImage = document.createElement("img");
	singleNoteImage.className="single_note_image";
	singleNoteImage.src ="img/notebg.png";
	
	singleNoteDeleteIcon = document.createElement("button");
	singleNoteDeleteIcon.id = "delete_note-"+t_id;
	singleNoteDeleteIcon.className = "glyphicon glyphicon-trash";
	singleNoteDeleteIcon.title = "delete note";
		
	singleNoteDesc = document.createElement("div");
	singleNoteDesc.id = "note_desc"+t_id;
	
	singleNoteDate = document.createElement("div");
	singleNoteDate.id = "note_date"+t_id;
	
	singleNoteContainer.appendChild(singleNoteImage);
	singleNoteContainer.appendChild(singleNoteDeleteIcon);
	singleNoteContainer.appendChild(singleNoteDesc);
	singleNoteContainer.appendChild(singleNoteDate);
	
	
};

function addAllNoteElementsOnPage(){
	try{ 
	   var storedList = JSON.parse(localStorage.getItem("my_task_list"));
	   notesContainer = document.getElementById("notes_container");
	   for (i=0; i<storedList.length; i++){
	   addSingleNoteElementOnPage(storedList[i].id);
		 
        }
	}catch(err){};
}

function setTaskNoteDesc (taskListArray, idNum){
	
	var idIndex = findWithAttr(taskListArray, "id",idNum);
	
     document.getElementById("note_desc"+idNum).innerText = taskListArray[idIndex].description;	
	
}

function setTaskNoteDay(taskListArray, idNum){
	 var idIndex = findWithAttr(taskListArray, "id",idNum);
	 document.getElementById("note_date"+idNum).innerText = "Due: "+taskListArray[idIndex].time;
	 
}

function writeSingleNoteDataToElement(t_id){
	
    var storedList = JSON.parse(localStorage.getItem("my_task_list"));	
    setTaskNoteDesc(storedList, t_id);
	setTaskNoteDay(storedList, t_id);
    var myNode = document.getElementById("single_note_container-"+t_id);
	
}

function writeAllNotesDataToElements(){
    try{
      var storedList = JSON.parse(localStorage.getItem("my_task_list"));

      for (i=0; i<storedList.length; i++){
       setTaskNoteDesc(storedList, storedList[i].id);
	   setTaskNoteDay(storedList, storedList[i].id);
	   var myNode = document.getElementById("single_note_container-"+storedList[i].id);
		
       }
    }     catch(err){};
}

function fadeInAllElements(){
	var myElements = document.querySelectorAll(".single_note_container");
   setTimeout(function(){
	  
   for (i=0 ;1<myElements.length; i++){
	var id = myElements[i];
	id.style.opacity = "1";

       }   },50);
	
	
}

function submitForm (){
      newTaskDescription = document.getElementById("form_desc").value ;
	  if(newTaskDescription==null || newTaskDescription == ""){
		reportErrorById("form_err", errors[0]);
		console.log("validated description");
		return ;    
	  }
	 
	  newTaskTime = document.getElementById("form_time").value ;
	  if(!isValidDate(newTaskTime)){
		reportErrorById("form_err", errors[1]);
		console.log("validated a valid date");
		return ;}  
		
	  if(isDateRangeValid(newTaskTime)){
	console.log("data is valid , starting to write note");

	   var task_id = addTaskToStorage(newTaskDescription, newTaskTime);
	   
	  console.log("going to add note to HTML");
       addSingleNoteElementOnPage(task_id);
	   
	   console.log("added elemnt to html");
	   writeSingleNoteDataToElement(task_id);
	  
	   waitForDeleteEvent();
	   return task_id;
	   
	   }else{
	    reportErrorById("form_err", errors[2]);
		return ;
	   };		
	
}

function reportErrorById(elementID, message){
        var err = document.getElementById(elementID);
		err.innerText = message;
		return;    	
	
}

function deleteTaskNoteFromStorage (elementId, prefix){
	
	 var taskId = elementId.split("-").pop();
	 taskList = JSON.parse(localStorage.getItem("my_task_list"));
	 for (i=0; i< taskList.length; i++){
	  
		if (taskList[i].id == taskId){
			
		localStorage.removeItem("my_task_list");
		taskList.splice(i,1);
		
		localStorage.setItem("my_task_list", JSON.stringify(taskList));	
       	  
        }
	 }	
}

function deleteSingleElementWithChildren(e_id){
	e_id = e_id.split("-").pop();
	var p_id = "single_note_container-"+e_id;
	var myNode = document.getElementById(p_id);

	myNode.style.opacity = "0";
	setTimeout(function(){
		 try{
	  while(myNode.firstChild!=null){
		
		 myNode.removeChild(myNode.firstChild);
	   	
	    }
	
	  var myParent = myNode.parentNode;
	   myParent.removeChild(myNode);
	  }
	catch(err){};
		}, 2000);
	 
	
}

function waitForDeleteEvent(){

		var note_el = document.querySelectorAll(".glyphicon-trash");
		var	result;
		for (var i = 0; i < note_el.length; i++) {
	        result = note_el[i];
	        result.addEventListener('click', function() {
			deleteSingleElementWithChildren(this.id);
			deleteTaskNoteFromStorage(this.id, "delete_note");
				
		    });

		}
}

///this function allows creating an event listener for multiple events types
function addListenerMulti(element, eventNames, listener) {
  var events = eventNames.split(' ');
  for (var i=0, iLen=events.length; i<iLen; i++) {
    element.addEventListener(events[i], listener, false);
  }
}

///this function cancels submission of the form on enter key
function cancelReturnInForm(evt) { 
  var evt = (evt) ? evt : ((event) ? event : null); 
  var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null); 
  if ((evt.keyCode == 13) && (node.type=="text"))  {return false;} 
} 


	
////// on page load - these function will place all the existing data with it's HTML onto the page and will be ready for deleting exiting notes
addAllNoteElementsOnPage();
writeAllNotesDataToElements();
fadeInAllElements();
waitForDeleteEvent();


//// after initial data was placed on the page - listeners will wait for events of adding new notes or serve as a mean to clear error messages after form validation
addListenerMulti(document.getElementById("form_desc"), 'click keydown',function(){
	document.getElementById("form_err").innerText = "";
	});
	
document.onkeypress = cancelReturnInForm; 
	
addListenerMulti(document.getElementById("form_time"), 'click keydown',function(event){
	
	switch (event.keyCode){
		case 13: 
		var obj = submitForm();
		setTimeout(function(){
	    var el =document.getElementById("single_note_container-"+obj);
	    el.style.opacity="1";
		},300);
		break;
		
		default: document.getElementById("form_err").innerText = "";
		
	  }
		
	});


////listener for creating a the note
document.getElementById("save_note").addEventListener("click", function(){
	console.log("identified save click");
	try{
		console.log("trying to submit");
	var obj = submitForm();
	console.log("submitted form");
	setTimeout(function(){
	var el =document.getElementById("single_note_container-"+obj);
	el.style.opacity="1";
	}, 300);
	
	
	} catch(err){};
	
	
	});
 
   
	