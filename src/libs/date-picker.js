import Vue from 'vue'
import VuePersianDatetimePicker from 'vue-persian-datetime-picker';
Vue.use(VuePersianDatetimePicker, {
  name: 'date-picker',
  props: {
    format: 'YYYY-MM-DD HH:mm:ss',
    displayFormat: 'jDD jMMMM jYYYY ساعت HH:mm',
    editable: false,
    inputClass: 'form-control my-custom-class-name',
    placeholder: 'لطفا تاریخ را انتخاب کنید',
    altFormat: 'YYYY-MM-DD HH:mm',
    color: '#00acc1',
    autoSubmit: false,
    //...  
    //... And whatever you want to set as default.
    //... 
  }
});

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

export function formatDate(date) {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-') +
    ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(':')
  );
}