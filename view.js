
//输入参数 改变chart的Xscale Y scale by lixuan
let chart1 = new Chart('.chart1', 10,10,500);   
let chart2 = new Chart('.chart2', 30,10,8500);

var ipcRenderer = require('electron').ipcRenderer;
ipcRenderer.on('chart-data', function (event, datas) {
  // console.log(data);
  //更新chart  最后两个参数为正负0.05 这里测试一下 by lixuan
  chart1.updateChart([datas[0], datas[1], datas[2]],datas[1]*1.05,datas[1]*0.95);
  chart2.updateChart([datas[3], datas[4], datas[5]],datas[3]*1.05,datas[5]*0.95);
});

ipcRenderer.on('bp-data', function (event, datas) {
  const heartRate = datas[0];
  const meanArterialPressure = datas[1];
  const systolicPressure = datas[2];
  const diastolicPressure = datas[3];
  const bloodPressureAC = datas[4];
  document.querySelector('.heartRate').textContent = `Heart Rate = ${heartRate} per min`;
  document.querySelector('.meanArterialPressure').textContent = `MAP = ${meanArterialPressure} mmHg`;
  document.querySelector('.systolicPressure').textContent = `Systolic Pressure = ${systolicPressure} mmHg`;
  document.querySelector('.diastolicPressure').textContent = `Diastolic Pressure = ${diastolicPressure} mmHg`;
  document.querySelector('.bloodPressureAC').textContent = `Blood Pressure AC = ${bloodPressureAC} ohm`;
});

ipcRenderer.on('no-save', function (event, datas) {
  document.getElementById('saveRaw').checked = false;
});



window.addEventListener('load', event => {
  document.getElementById('saveRaw').addEventListener('click', event => {
    // console.log( document.getElementById('saveRaw').checked );
    ipcRenderer.send('saveRaw', document.getElementById('saveRaw').checked);
  });
}, true);
