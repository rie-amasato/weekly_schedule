function rendering(){
	const ids_week=["date_Mon", "date_Tue", "date_Wed", "date_Thu", "date_Fri", "date_Sat", "date_Sun"];

	const date_print=new Date(page.startday)
	ids_week.forEach((id_week)=>{
		document.getElementById(id_week).innerHTML=`${date_print.getMonth()+1}/${date_print.getDate()}`;
		date_print.setDate(date_print.getDate()+1)
	});


	delTasks();

	page.tasks.forEach((task)=>{
		if ((page.startday<=task.endday && task.endday<=page.endday) || (task.startday!="" || task.endday!="")){
			task.draw(page);
		}
	});
	page.savetasks();
}

function delTasks(){
	elm_tasks=document.getElementById("shedule-table").getElementsByClassName("sct-data");

	Array.from(elm_tasks).forEach((task)=>{
		//console.log(task.dataset.num)
		//if (task.dataset.num==int_task || int_task==-1){
		task.remove()
		//}
	});
}

function addTask(){
	page.tasks.push(new Task(
		finished=false,
		taskname="New task",
		start=page.startday,
		end=page.startday,
	));
	rendering();
}

class Task {
	constructor(
			finished=false,
			taskname="New task",
			start="",
			end=""
		){

console.log(start)
		// this.tasknum=tasknum;
		this.finished=finished;
		this.taskname=taskname;
		//this.manname="";

		if (start)this.start=new Date(start);
		else this.start=new Date(new Date);

		if (end)this.end=new Date(end);
		else this.end=new Date(new Date);
	}
	
	changetaskname(){
		this.taskname="Changed";
	}

	draw(page){
		const elm_tr=document.createElement("tr");
		elm_tr.className="sct-data";

		const elm_check=document.createElement("td");
		elm_tr.appendChild(elm_check);

		const elm_taskname=document.createElement("td");
		elm_taskname.innerHTML=this.taskname;
		elm_taskname.onclick=()=>{
			const newname=window.prompt("新しいタスク名", this.taskname||"");
			this.taskname=newname;
			rendering();
		}

		elm_tr.appendChild(elm_taskname);

		const elm_startday=document.createElement("td");
		const elm_input_startday=document.createElement("input");
		elm_input_startday.size=5;
		elm_input_startday.type="text";

		const elm_endday=document.createElement("td");
		const elm_input_endday=document.createElement("input");
		elm_input_endday.size=5;
		elm_input_endday.type="text";

		const ntask=this
		const picker=new Lightpick({
			field: elm_startday,
			secondField: elm_input_endday,
			onSelect: function(start, end){
				
				// console.log(start.format("MM/DD"));

				if (start){
					ntask.start=new Date(start)
					elm_startday.innerHTML=start.format("MM/DD");
					page.savetasks();
				}

				if (end){
					ntask.end=new Date(end);
					elm_endday.innerHTML=end.format("MM/DD");
					
					page.savetasks();
				}
				rendering(page);
			}
		});

		
		elm_startday.innerHTML=`${this.start.getMonth()+1}/${this.start.getDate()}`;
		elm_endday.innerHTML=`${this.end.getMonth()+1}/${this.end.getDate()}`;

		//elm_startday.appendChild(elm_input_startday)
		elm_tr.appendChild(elm_startday);
		//elm_endday.appendChild(elm_input_endday)
		elm_tr.appendChild(elm_endday);

		let draw=false;
		for (let i=0; i<7; i+=1){
			const elm_day=document.createElement("td");

			let donecolor="#BB66BB";

			if(this.done)donecolor="#AAAAAA";
			// 今日より前の日付が完了予定だったら炎上レッド
			else if(this.end<page.today)donecolor="#FF4466";
			
			//console.log(this.start)
			//console.log(page.startday)
			const startdiff=(this.start-page.startday);
			const enddiff=(this.end-page.startday);

			if (startdiff<=(i+1)*(1000*60*60*24) && i*(1000*60*60*24)<=enddiff){
				elm_day.style.backgroundColor=donecolor;
				//elm_day.style.borderRightColor=donecolor;
				draw=true;
			}
			
			elm_tr.appendChild(elm_day);
		}

		if (draw)document.getElementById("shedule-table").appendChild(elm_tr);
	}
}

class Page{
	constructor(){
		this.tasks=[];
		this.today;
		this.startday;
		this.endday;


	this.today=new Date(new Date().toDateString());
	this.startday=new Date(new Date().toDateString());
	// console.log(this.today);
	// console.log(page.today.getDay());
	
	if (this.today.getDay()==0){
		this.startday.setDate(this.today.getDate()-6);
	}else{
		this.startday.setDate(this.today.getDate()-this.today.getDay()+1);
	}
	// console.log(page.startday);

	this.endday=new Date(this.startday);
	this.endday.setDate(this.endday.getDate()+6);
	//console.log(this.endday);

		if (document.cookie != ""){
			JSON.parse(decodeURI(document.cookie).split("=")[1]).forEach((task)=>{
				//console.log(task)
				//console.log(task["finished"])
				//console.log(task.finished)

				this.tasks.push(
					new Task(
						task.finished,
						task.taskname,
						task.start,
						task.end
					)
				)
			})
		}

		else{
			this.tasks.push(new Task(this.startday))
			this.tasks.push(new Task(this.startday))
			this.tasks[1].taskname="初期タスク1"
			this.tasks[1].taskname="初期タスク2"
		}
		//console.log(this.tasks)
	}


	savetasks(){
		const encodeddata=encodeURI(JSON.stringify(this.tasks))
		document.cookie="tasks="+encodeddata+";"
		//console.log(encodeddata);
	}
} 

function seekweek(int_sday){
	page.startday.setDate(page.startday.getDate()+int_sday);
	page.endday.setDate(page.endday.getDate()+int_sday);

	rendering(page);

	//console.log(page.startday)
}


const page=new Page;
//initial(page);
rendering(page);
