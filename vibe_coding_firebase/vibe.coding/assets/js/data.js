/* Demo-only seed records. All persisted application data remains in this browser's localStorage. */
window.NEXORA_SEED = (() => {
  const iso = (daysBack, hours=10) => { const d = new Date(); d.setDate(d.getDate()-daysBack); d.setHours(hours,18,0,0); return d.toISOString(); };
  const products = [
    ['LAP-001','MacBook Air 13 M3','Apple','Laptop',15499000,17199000,8,3,'SUP-001','8GB / 256GB SSD · Midnight'],
    ['LAP-002','ASUS Vivobook 14','ASUS','Laptop',7199000,8599000,14,4,'SUP-002','Intel Core i5 · 16GB / 512GB'],
    ['LAP-003','Lenovo IdeaPad Slim 3','Lenovo','Laptop',6699000,7999000,6,4,'SUP-002','Ryzen 5 · 8GB / 512GB'],
    ['LAP-004','Acer Swift Go 14','Acer','Laptop',11099000,12999000,3,4,'SUP-002','Intel Core Ultra 5 · OLED'],
    ['LAP-005','HP Pavilion 15','HP','Laptop',8899000,10499000,9,3,'SUP-002','Ryzen 7 · 16GB / 512GB'],
    ['LAP-006','MacBook Pro 14','Apple','Laptop',25999000,29499000,2,2,'SUP-001','M4 Pro · 16GB / 512GB'],
    ['PHN-001','iPhone 16 128GB','Apple','Smartphone',11799000,13499000,12,4,'SUP-001','Ultramarine · 6.1 inci'],
    ['PHN-002','Samsung Galaxy S25','Samsung','Smartphone',11999000,13999000,10,3,'SUP-003','12GB / 256GB · Navy'],
    ['PHN-003','Xiaomi 14T','Xiaomi','Smartphone',5499000,6499000,17,5,'SUP-003','12GB / 256GB · Titan Gray'],
    ['PHN-004','OPPO Reno13 5G','OPPO','Smartphone',6399000,7499000,4,5,'SUP-003','12GB / 256GB · Plume White'],
    ['PHN-005','Samsung Galaxy A56','Samsung','Smartphone',4799000,5999000,21,6,'SUP-003','8GB / 256GB · Awesome Graphite'],
    ['PHN-006','Google Pixel 9','Google','Smartphone',10499000,11999000,5,3,'SUP-001','12GB / 128GB · Obsidian'],
    ['TAB-001','iPad Air 11 M3','Apple','Tablet',8999000,10999000,11,3,'SUP-001','128GB Wi-Fi · Space Gray'],
    ['TAB-002','Samsung Galaxy Tab S10','Samsung','Tablet',10199000,11999000,7,3,'SUP-003','12GB / 256GB · Moonstone Gray'],
    ['TAB-003','Xiaomi Pad 7','Xiaomi','Tablet',4299000,5499000,13,4,'SUP-003','8GB / 128GB · Gray'],
    ['TAB-004','Lenovo Tab P12','Lenovo','Tablet',4199000,5299000,2,3,'SUP-002','8GB / 128GB · Storm Gray']
  ].map((r, i) => ({id:'P'+String(i+1).padStart(3,'0'),sku:r[0],name:r[1],brand:r[2],category:r[3],cost:r[4],price:r[5],stock:r[6],minStock:r[7],supplierId:r[8],description:r[9],active:true,createdAt:iso(70-i)}));
  const customers = [
    ['C001','Andi Pratama','081234560001','andi@example.com','Surabaya'],
    ['C002','Nadia Putri','081234560002','nadia@example.com','Malang'],
    ['C003','Rizky Ramadhan','081234560003','rizky@example.com','Probolinggo'],
    ['C004','Salsabila Rahma','081234560004','salsa@example.com','Jember'],
    ['C005','Budi Santoso','081234560005','budi@example.com','Pasuruan']
  ].map(r=>({id:r[0],name:r[1],phone:r[2],email:r[3],address:r[4]}));
  const suppliers = [
    {id:'SUP-001',name:'PT Nusantara Digital Supply',phone:'021-555-0123',email:'sales@nusantaradigital.example',address:'Jakarta Pusat'},
    {id:'SUP-002',name:'CV Komputer Prima',phone:'031-555-0148',email:'admin@komputerprima.example',address:'Surabaya'},
    {id:'SUP-003',name:'PT Mobile Teknologi',phone:'022-555-0177',email:'order@mobileteknologi.example',address:'Bandung'}
  ];
  const users = [
    {id:'U001',name:'Raka Administrator',email:'admin@nexora.demo',password:'Admin123!',role:'admin',active:true},
    {id:'U002',name:'Maya Manajer',email:'manager@nexora.demo',password:'Manager123!',role:'manager',active:true},
    {id:'U003',name:'Dimas Kasir',email:'kasir@nexora.demo',password:'Kasir123!',role:'kasir',active:true},
    {id:'U004',name:'Putri Gudang',email:'gudang@nexora.demo',password:'Gudang123!',role:'gudang',active:true}
  ];
  const sales = [];
  const examples = [
    [2,'C001',[['P002',1],['P009',1]],200000,'QRIS','U003'],
    [4,'C002',[['P007',1]],0,'Transfer','U003'],
    [5,'C004',[['P013',1],['P015',1]],100000,'Tunai','U003'],
    [9,'C003',[['P011',2]],0,'QRIS','U003'],
    [14,'C001',[['P001',1]],300000,'Transfer','U003'],
    [20,'C005',[['P014',1]],0,'Debit','U003'],
    [29,'C004',[['P003',1],['P016',1]],150000,'QRIS','U003'],
    [40,'C002',[['P008',1]],0,'Transfer','U003'],
    [65,'C001',[['P010',1]],0,'Tunai','U003']
  ];
  examples.forEach((r,i)=>{
    const items=r[2].map(([id,qty])=>{ const p=products.find(x=>x.id===id);return {productId:id,sku:p.sku,name:p.name,category:p.category,qty,price:p.price,cost:p.cost}; });
    const subtotal=items.reduce((n,x)=>n+x.qty*x.price,0); const discount=r[3]; const tax=Math.round((subtotal-discount)*0.11); const grandTotal=subtotal-discount+tax;
    sales.push({id:'S'+String(i+1).padStart(4,'0'),number:`NX-${new Date(iso(r[0])).getFullYear()}-${String(i+1).padStart(4,'0')}`,date:iso(r[0]),customerId:r[1],items,subtotal,discount,tax,grandTotal,paymentMethod:r[4],paid:grandTotal,change:0,status:'Selesai',cashierId:r[5],note:''});
  });
  return {version:1,settings:{storeName:'Nexora Tech',tagline:'Smart devices. Smarter business.',address:'Jl. Teknologi No. 88, Surabaya, Jawa Timur',phone:'(031) 8888-2026',taxRate:11,receiptFooter:'Terima kasih sudah berbelanja di Nexora Tech!',invoicePrefix:'NX'},products,customers,suppliers,users,sales,purchases:[],activities:[{id:'A1',at:iso(0,9),actor:'Sistem',action:'Data demo Nexora Tech siap digunakan'}]};
})();
