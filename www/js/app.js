document.addEventListener("backbutton", onBackKeyDown, false);
function onLoad() {document.addEventListener("deviceready", onDeviceReady, false);}
// Cordova is loaded and it is now safe to call Cordova methods

// Register the event listener
function onDeviceReady() {document.addEventListener("backbutton", onBackKeyDown, false);}

// Handle the back button
function onBackKeyDown() {
  if((app.form.getFormData('page')=='/' || app.form.getFormData('page')=='/masuk/')&&app.form.getFormData('exit')==false){
    app.form.storeFormData('exit',true)
    app.dialog.confirm('Are you sure you want to exit?','Exit. . .', function () {
      navigator.app.exitApp();
    },function () {
      app.form.storeFormData('exit',false)
    });
  }else{
    app.form.storeFormData('page','/');
    $$('[class="link back"]').click()
  }
}

//const axios = require('axios');
//var baseurl = 'http://localhost/rest-api-e-loundri/public';

// Dom7
var $$ = Dom7;

// Theme
var theme = 'auto';
if (document.location.search.indexOf('theme=') >= 0) {
  theme = document.location.search.split('theme=')[1].split('&')[0];
}

// Init App
var app = new Framework7({
  id: 'io.framework7.testapp',
  root: '#app',
  theme: theme,
  pushState : true,
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };
  },
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  
  routes: routes,
  vi: {
    placementId: 'pltd4o7ibb9rc653x14',
  },
  
});

//var baseurl = 'http://localhost:89/public';//app.form.getFormData('url');
var baseurl = 'https://ante-nicene-termina.000webhostapp.com';//app.form.getFormData('url');










var toastsucess = app.toast.create({
  text: 'berhasil',
  closeTimeout: 2000,
});

var toastpingg = app.toast.create({
  text: 'ping sukses',
  closeTimeout: 2000,
});

var toasterr = app.toast.create({
  text: 'gagal',
  closeTimeout: 2000,
});



$$(document).on('page:init',function (e) {
  if(app.form.getFormData('level')=='pemilik'){
    $$('[akses="pemilik"]').show()
  }
  else if(app.form.getFormData('level')=='pegawai'){
    $$('[akses="pemilik"]').hide()
  }
  app.form.storeFormData('exit',false);
  app.form.storeFormData('page',e.detail.router.url);
  var token = app.form.getFormData('token');
  $$('.reload').click(function(e){
    app.views.main.router.refreshPage();
  })
  if(!token){
    app.views.main.router.navigate('/masuk/')
  }
  axios.post(baseurl+'/pengguna/cek', {},{headers: {'Content-Type': 'application/json','Authorization': app.form.getFormData('token')}})
    .then(function (data) {
      console.log('data',data.data.status)
      if(data.data.status=='unauthorized'){
        app.form.removeFormData('token');
        app.views.main.router.navigate('/masuk/')
      }

    }).catch(function (error) {
      console.log(error);
      toasterr.open();
  });
})

$$(document).on('page:init', '.page[data-name="home"]', function (e) {
 var tanggal = new Date().getFullYear()+'-'+('0' + (new Date().getMonth() + 1)).slice(-2)+'-'+ ('0' + (new Date().getDate() + 1)).slice(-2)
 $$('#tanggal_pembayaran').val(tanggal);

 render_chat_harian();

  
});

$$(document).on('page:init', '.page[data-name="masuk"]', function (e) {
  $$('#masuk').click(function(e){
    app.request.post(baseurl+'/masuk',{ nama_pengguna: $$('input#demo-username-2').val(), password:  $$('input#demo-password-2').val() }, function (data) {
      var data_j = JSON.parse(data); 
      if(data_j.proses){
         // app.form.storeFormData('data_user',data_j);
          app.form.storeFormData('token','Bearer '+ data_j.token);
          app.form.storeFormData('level', data_j.level);
          app.views.main.router.navigate('/')
        }
      if(!data_j.proses){
        toasterr.open();
        }
      });
  });
  $$('#ping').click(function(e){
    app.request.post($$('input#url').val()+'/ping',{}, function (data) {
      var data_j = JSON.parse(data); 
      if(data_j.proses){
        app.form.storeFormData('url',$$('input#url').val());
        toastpingg.open()
        }
      if(!data_j.proses){
        toasterr.open();
        }
      });
  });
});

$$(document).on('page:init', '.page[data-name="list-ticket"]', function (e) {
  app.form.storeFormData('offset_list_ticket',10);
    $$('.page-content').scroll(function(e){
    var a = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        console.log(a)
    if(a){
      list_ticket(app.form.getFormData('offset_list_ticket'))
    }
  })
  axios.post(baseurl+'/ticket/list', {limit:10,offset:0}, {headers: {'Content-Type': 'application/json','Authorization':app.form.getFormData('token')}})
  .then(function (data) {
    //router.refreshPage()
    var html = "";
    var v = data.data.data;
    console.log(v)
    for(i=0;i<v.length;i++){
       html +='<li>';
       html +='  <a href="/detail-ticket/?id='+v[i].id_ticket+'" class="item-link item-content">';
       html +='       <div class="item-inner">';
       html +='        <div class="item-title-row">';
       html +='         <div class="item-title">';
       html +=          v[i].nama_pelanggan;
       html +=          '</div>';
       html +='         <div class="item-after">'+new Date(v[i].tanggal).getHours()+' : '+new Date(v[i].tanggal).getMinutes()+'</div>';
       html +='         </div>';
       html +='          <div class="item-subtitle">';
       html +=           v[i].tgl;
       html +=            '&nbsp;&nbsp;&nbsp;';
       if(v[i].status_ticket==='baru'){html+='<span class="badge color-blue">'+v[i].status_ticket+'</span>'}
                          else if(v[i].status_ticket==='proses'){html+='<span class="badge color-orange">'+v[i].status_ticket+'</span>'}
                          else if(v[i].status_ticket==='selesai'){html+='<span class="badge color-green">'+v[i].status_ticket+'</span>'}
       html +=          '</div>';
       html +='         <div class="item-text">Aalamat : '+v[i].alamat_pelanggan+'</div>';
       html +='         <div class="item-text">Kode : '+v[i].kode+'</div>';
       html +='         <div class="item-text">pembayaran : ';
       if(v[i].pembayaran==='belum lunas'){html+='<span class="badge color-red">'+v[i].pembayaran+'</span>'}
       else if(v[i].pembayaran==='lunas'){html+='<span class="badge color-green">'+v[i].pembayaran+'</span>'}
       html +=' </div>';
       html +='      </div>';
       html +='     </a>';
       html +='  </li>';
      }
      $$('#list-ticket').html(html);
    })
    .catch(function (error) {
      console.log(error);
      toasterr.open();
  });
});


$$(document).on('page:init', '.page[data-name="detail-ticket"]', function (e) {
  var id = $$(this).data('id');
  $$('#selesai').click(function(){
    axios.post(baseurl+'/transaksi/selesai', {
      id_ticket:id,
    }, {headers: {'Content-Type': 'application/json','Authorization':app.form.getFormData('token')}})
    .then(function (data) {
      app.views.main.router.refreshPage()
        })
      .catch(function (error) {
        console.log(error);
        toasterr.open();
    });
  });
  $$('#hapus').click(function(){
    axios.post(baseurl+'/transaksi/hapus-permanen', {
      id_ticket:id,
    }, {headers: {'Content-Type': 'application/json','Authorization':app.form.getFormData('token')}})
    .then(function (data) {
      app.views.main.router.back()
        })
      .catch(function (error) {
        console.log(error);
        toasterr.open();
    });
  });
  $$('#tambah').click(function(e){
    axios.post(baseurl+'/transaksi/tambah', {
      id_harga:$$('#list_harga').val(),
      id_ticket:id,
      jumlah:$$('#jumlah').val(),
    }, {headers: {'Content-Type': 'application/json','Authorization':app.form.getFormData('token')}})
    .then(function (data) {
      app.views.main.router.refreshPage()
        })
      .catch(function (error) {
        console.log(error);
        toasterr.open();
    });
  });
  $$('#lunas').click(function(e){
    axios.post(baseurl+'/ticket/lunas', {
      id_ticket:id,
    }, {headers: {'Content-Type': 'application/json','Authorization':app.form.getFormData('token')}})
    .then(function (data) {
      $$(document).on('.reload.ticket','click')
      app.views.main.router.refreshPage()
        })
      .catch(function (error) {
        console.log(error);
        toasterr.open();
    });
  });
  $$('#belum_lunas').click(function(e){
    axios.post(baseurl+'/ticket/belum-lunas', {
      id_ticket:id,
    }, {headers: {'Content-Type': 'application/json','Authorization':app.form.getFormData('token')}})
    .then(function (data) {
      app.views.main.router.refreshPage()
        })
      .catch(function (error) {
        console.log(error);
        toasterr.open();
    });
  });
  axios.post(baseurl+'/ticket/detail', {id_ticket:$$(this).data('id')}, {headers: {'Content-Type': 'application/json','Authorization':app.form.getFormData('token')}})
  .then(function (data) {
    var html = "";
    var html2 = "";
    var v = data.data.ticket[0];
    var v2 = data.data.transaksi;
    var v3 = data.data.total;
    var v4 = data.data.list_harga;
    console.log(data.data.ticket.length)
    if(data.data.ticket.length <= 0){
      app.views.main.router.back()
    }
   
    if(v.status_ticket=='selesai'&&app.form.getFormData('level')!='pemilik'){
      $$('.selesai').hide();
    }
    $$('#nama_pengguna').html(v.nama_pengguna)
    $$('#alamat_pelanggan').html(v.alamat_pelanggan)
    $$('#nama_pelanggan').html(v.nama_pelanggan)
    $$('#status_ticket').html(v.status_ticket)
    $$('#tgl').html(v.tgl)
    $$('#telp_pelangan').html(v.telp_pelangan)
    $$('#id').html(v.kode)
   
    if(v3){
      $$('#total_biaya').html('<h2 style="text-align: center">Rp '+v3+' ,-</h2>')
    }
    //console.log(v2)
    for(i=0;i<v2.length;i++){
      html+=' </li>';
      html+='   <a href="#" class="item-link item-content">';
      html+='     <div class="item-inner">';
      html+='       <div class="item-title">';
      html+='         <div class="item-header">'+v2[i].m_nama+'</div>';
      html+='         <div">'+v2[i].jumlah+' x '+v2[i].m_harga+' = '+v2[i].jumlah_x_harga+'</div>';
      html+='         <div class="item-after">Hapus</div>';
      html+='       </div>';
      html+='     </div>';
      html+='    </a>';
      html+=' </li>';
       }
       $$('#list_cucian').html(html);

       for(i=0;i<v4.length;i++){
         html2+='<option value="'+v4[i].m_id_harga+'">'+v4[i].m_nama+'</option>';
        }
        $$('#list_harga').html(html2);
      })
    .catch(function (error) {
      app.views.main.router.back()
      console.log(error);
      toasterr.open();
  });
});

$$(document).on('page:init', '.page[data-name="tambah-ticket"]', function (e) {
 $$('#tambah').click(function(e){
   var uuid = lil.uuid();
   axios.post(baseurl+'/ticket/tambah', {
     nama_pelanggan: $$('#nama_pelangan').val(),
     telp_pelangan: $$('#telfon').val(),
     id_ticket: uuid,
     alamat_pelanggan: $$('#alamat').val()
   },{headers: {'Content-Type': 'application/json','Authorization':app.form.getFormData('token')}})
   .then(function (data) {
    if(data.data.proses){
     toastsucess.open();
    // app.views.main.router.navigate('/detail-ticket/?id='+uuid)
     app.views.main.router.back()
    }
   })
   .catch(function (error) {
     console.log(error);
     toasterr.open();
   });
 })
});

$$(document).on('page:init', '.page[data-name="list-pengguna"]', function (e) {
  // this.data = {};
  axios.post(baseurl+'/pengguna/list', {}, {headers: {'Content-Type': 'application/json','Authorization':app.form.getFormData('token')}})
  .then(function (data) {
    var html = "";
    var v = data.data.data;
    this.data = v;
    for(i=0;i<v.length;i++){
      html +='<li id="ubah_data">';
       html +='<a href="/ubah-pegawai/?nama='+v[i].nama+'&nama_pengguna='+v[i].nama_pengguna+'&telfon='+v[i].telfon+'&level='+v[i].level+'&alamat='+v[i].alamat+'&id='+v[i].id+'">';
       html +='<div class="item-content">';
       html += '<div class="item-media"><i class="f7-icons">person_fill</i></div>';
       html +=  '<div class="item-inner">';
       html +=   '<div class="item-title">'+v[i].nama_pengguna+'</div>';
       html +=   '<div class="item-after">';
       if(v[i].level==='pemilik'){html+='<span class="badge color-blue">'+v[i].level+'</span>'}
       else if(v[i].level==='pegawai'){html+='<span class="badge color-orange">'+v[i].level+'</span>'}
       html+='</div>';
       html += '</div>';
       html +='</div>';
       html +='</a>';
       html +='</li>';
      }
    $$('#list-pengguna').html(html);
  })
  .catch(function (error) {
    console.log(error);
    toasterr.open();
  });
});
$$(document).on('page:init', '.page[data-name="list-harga"]', function (e) {
  // this.data = {};
  axios.post(baseurl+'/m-harga/list', {}, {headers: {'Content-Type': 'application/json','Authorization':app.form.getFormData('token')}})
  .then(function (data) {
    var html = "";
    var v = data.data.data;
    this.data = v;
    for(i=0;i<v.length;i++){
      html +='<li id="ubah_data">';
       html +='<a href="/ubah-harga/?nama='+v[i].nama+'&m_nama='+v[i].m_nama+'&m_harga='+v[i].m_harga+'&id='+v[i].m_id_harga+'">';
       html +='<div class="item-content">';
      // html += '<div class="item-media"><i class="f7-icons">person_fill</i></div>';
       html +=  '<div class="item-inner">';
       html +=   '<div class="item-title">'+v[i].m_nama+'</div>';
       html +=   '<div class="item-after">';
      html+=v[i].m_harga;
       html+='</div>';
       html += '</div>';
       html +='</div>';
       html +='</a>';
       html +='</li>';
      }
    $$('#list-pengguna').html(html);
  })
  .catch(function (error) {
    console.log(error);
    toasterr.open();
  });
});

$$(document).on('page:init', '.page[data-name="tambah-pengguna"]', function (e) {
 $$('#tambah').click(function(e){
   axios.post(baseurl+'/daftar', {
     nama_pengguna: $$('#nama_pengguna').val(),
     password: $$('#password').val(),
     nama: $$('#nama').val(),
     level: $$('#level').val(),
     telfon: $$('#telfon').val(),
     alamat: $$('#alamat').val()
    },{headers: {'Content-Type': 'application/json'}})
   .then(function (data) {
    if(data.data.proses){
     toastsucess.open();
     app.views.main.router.back()
    }
  })
  .catch(function (error) {
     console.log(error);
    });
 })
});

$$(document).on('page:init', '.page[data-name="tambah-ticket"]', function (e) {
  $$('#tambah').click(function(e){
   axios.post(baseurl+'/daftar', {
     nama_pelanggan: $$('#nama_pelangan').val(),
     telfon: $$('#telfon').val(),
     alamat: $$('#alamat').val()
   },{headers: {'Content-Type': 'application/json'}})
   .then(function (data) {
    if(data.data.proses){
     toastsucess.open();
     app.views.main.router.back()
    }
   })
   .catch(function (error) {
     console.log(error);
   });
 })
});

$$(document).on('page:init', '.page[data-name="ubah-pengguna"]', function (e) {
  $$('#level').val($$('#level').data('level'));
  $$('#ubah').click(function(e){
    axios.post(baseurl+'/pengguna/ubah', {
      nama_pengguna: $$('#nama_pengguna').val(),
      nama: $$('#nama').val(),
      level: $$('#level').val(),
      telfon: $$('#telfon').val(),
      id: $$('#ubah').data('id'),
      alamat: $$('#alamat').val()
    },{headers: {'Content-Type': 'application/json','Authorization':app.form.getFormData('token')}})
    .then(function (data) {
      console.log(data.data.proses)
      toastsucess.open();
    if(data.data.proses){
      app.views.main.router.back()
    }
    })
    .catch(function (error) {
      toasterr.open();
      console.log(error);
    });
  })

 $$('#ubah-password').click(function(e){
  axios.post(baseurl+'/pengguna/ubah-password', {
    password: $$('#password').val(),
    id: $$('#ubah').data('id')
  },{headers: {'Content-Type': 'application/json','Authorization':app.form.getFormData('token')}})
  .then(function (data) {
    console.log(data.data.proses)
    toastsucess.open();
   if(data.data.proses){
    app.views.main.router.back()
   }
  })
  .catch(function (error) {
    toasterr.open();
    console.log(error);
  });
 })
});
$$(document).on('page:init', '.page[data-name="ubah-harga"]', function (e) {
  $$('#ubah').click(function(e){
    axios.post(baseurl+'/m-harga/ubah', {
      m_nama: $$('#m_nama').val(),
      m_harga: $$('#m_harga').val(),
      id: $$('#ubah').data('id'),
    },{headers: {'Content-Type': 'application/json','Authorization':app.form.getFormData('token')}})
    .then(function (data) {
      console.log(data.data.proses)
      toastsucess.open();
    if(data.data.proses){
      app.views.main.router.back()
    }
    })
    .catch(function (error) {
      toasterr.open();
      console.log(error);
    });
  })

});
$$(document).on('page:init', '.page[data-name="tambah-harga"]', function (e) {
  $$('#tambah').click(function(e){
    axios.post(baseurl+'/m-harga/tambah', {
      m_nama: $$('#m_nama').val(),
      m_harga: $$('#m_harga').val(),
    },{headers: {'Content-Type': 'application/json','Authorization':app.form.getFormData('token')}})
    .then(function (data) {
      console.log(data.data.proses)
      toastsucess.open();
    if(data.data.proses){
      app.views.main.router.back()
    }
    })
    .catch(function (error) {
      toasterr.open();
      console.log(error);
    });
  })

});

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
function random_rgba() {
  var o = Math.round, r = Math.random, s = 155;
  return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
}

function logout(){
  app.form.removeFormData('token');
  app.views.main.router.navigate('/masuk/')
}

function list_ticket(offset){
  axios.post(baseurl+'/ticket/list', {limit:10,offset:offset}, {headers: {'Content-Type': 'application/json','Authorization':app.form.getFormData('token')}})
  .then(function (data) {
    //router.refreshPage()
    var html = "";
    var v = data.data.data;
    console.log(v)
    for(i=0;i<v.length;i++){
      html +='';
       html +='<li>';
       html +='  <a href="/detail-ticket/?id='+v[i].id_ticket+'" class="item-link item-content">';
       html +='       <div class="item-inner">';
       html +='        <div class="item-title-row">';
       html +='         <div class="item-title">';
       html +=          v[i].nama_pelanggan;
       html +=          '</div>';
       html +='         <div class="item-after">'+new Date(v[i].tanggal).getHours()+' : '+new Date(v[i].tanggal).getMinutes()+'</div>';
       html +='         </div>';
       html +='          <div class="item-subtitle">';
       html +=           v[i].tgl;
       html +=            '&nbsp;&nbsp;&nbsp;';
       if(v[i].status_ticket==='baru'){html+='<span class="badge color-blue">'+v[i].status_ticket+'</span>'}
                          else if(v[i].status_ticket==='proses'){html+='<span class="badge color-orange">'+v[i].status_ticket+'</span>'}
                          else if(v[i].status_ticket==='selesai'){html+='<span class="badge color-green">'+v[i].status_ticket+'</span>'}
       html +=          '</div>';
       html +='         <div class="item-text">Aalamat : '+v[i].alamat_pelanggan+'</div>';
       html +='      </div>';
       html +='     </a>';
       html +='  </li>';
      }
      $$('#list-ticket').append(html);
      app.form.storeFormData('offset_list_ticket',app.form.getFormData('offset_list_ticket')+10);
    })
    .catch(function (error) {
      console.log(error);
      toasterr.open();
  });
}

function render_chat_harian(){
  axios.post(baseurl+'/home/chat', {tanggal_pembayaran:$$('#tanggal_pembayaran').val(),pembayaran:$$('#pembayaran').val()},{headers: {'Content-Type': 'application/json','Authorization': app.form.getFormData('token')}})
 .then(function (data) {
   console.log('data',data.data.data)
   var i;
   var labelChat=[];
   var datachat=[];
   var backgroundColorChat=[];
   var borderColorChat=[];
   for (i = 0; i < data.data.data.length; i++) { 
    labelChat.push(data.data.data[i].m_nama);
    datachat.push(parseInt(data.data.data[i].nominal));
    backgroundColorChat.push(random_rgba());
    borderColorChat.push(random_rgba());
  }
   var ctx = document.getElementById('myChart');
   var myChart = new Chart(ctx, {
       type: 'bar',
       data: {
           labels: labelChat,
           datasets: [{
               label: '# ',
               data:datachat,
               backgroundColor: backgroundColorChat,
               borderColor: borderColorChat,
               borderWidth: 1
           }]
       },
       options: {
           scales: {
               yAxes: [{
                   ticks: {
                       beginAtZero: true
                   }
               }]
           }
       }
   });
 }).catch(function (error) {
  console.log(error);
  toasterr.open();
});
}