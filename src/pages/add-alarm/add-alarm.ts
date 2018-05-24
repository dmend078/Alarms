import { Component } from '@angular/core';
import { NavController, DateTime } from 'ionic-angular';
import { ModalController, NavParams,ViewController  } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { elementAt } from 'rxjs/operator/elementAt';
@Component({
  selector: 'page-add-alarm',
  templateUrl: 'add-alarm.html'
})
export class AddAlarmPage {

   public data = {id:0,alarmName:"",alarms:[
     {time:"00:00:00",title:"",body:""},
     {time:"00:00:00",title:"",body:""},
   ]}
   public isEdit = false;
   public alarmName = "";
   public firstAlarmTime = "00:00:00";
   public secondAlarmTime = "00:00:00";
  constructor( public viewCtrl: ViewController,private storage: Storage,public params:NavParams) {
      if (params.get('alarm')!=null)
      {
        this.data = params.get('alarm');
        this.isEdit = true;
      }
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  save()
  {
   if (this.isEdit == true)
   {
    this.editAlarm();
   }
   else
   {
     this.addAlarm();
   }


  }
  private addAlarm()
  {
    var tempData = {alarms:[]};
      this.storage.get('alarms').then((val)=>{
        tempData = val!=null ? val: {alarms:[]};
        if(tempData.alarms.length > 0)
        {
          this.data.id = tempData.alarms[tempData.alarms.length-1].id+1;
        }
        tempData.alarms.push(this.data);
        this.storage.set('alarms', tempData);     
        this.dismiss();
      });
  }
  private editAlarm()
  {
    var tempData = {alarms:[]};
    this.storage.get('alarms').then((val)=>{
      tempData = val!=null ? val: {alarms:[]};
      tempData.alarms[tempData.alarms.findIndex((element)=>{return element.id == this.data.id;})] = this.data;
      this.storage.set('alarms', tempData);     
      this.dismiss();
    });
  }
}
