
class Persona{
    Id: Number
    Nombres :string
    Apellidos :string
    Fecha_nacimiento : Date
    Condicion_medica :string[]
    Tipo_sangre : string
    Estatura: Number

    constructor(options  :any) {
        this.Id = options["Id"] as Number
        this.Nombres=options["Nombres"] as string
        this.Apellidos=options["Apellidos"] as string
        this.Fecha_nacimiento=new Date(Date.parse(options["Fecha_nacimiento"]as string)  as number  )
        this.Condicion_medica= options["Condicion_medica"] as string[]
        this.Tipo_sangre= options["Tipo_sangre"] as string
        this.Estatura= options["Estatura"] as Number

       }    

    toArray(){
        return [
            this.Id,this.Nombres,this.Apellidos,this.Fecha_nacimiento,
            this.Condicion_medica,this.Tipo_sangre,this.Estatura
        ]
    }
    toJSON() {
        return {
            "Id": this.Id,
            "Nombres" :this.Nombres,
            "Apellidos" :this.Apellidos,
            "Fecha_nacimiento" : this.Fecha_nacimiento.toISOString(),
            "Condicion_medica" : this.Condicion_medica,
            "Tipo_sangre":this.Tipo_sangre,
            "Estatura":this.Estatura

        }
    }
    static get_Formulario(){
        return new Persona({
            "Id": (document.getElementById("Id") as HTMLInputElement).value,
            "Nombres" :(document.getElementById("Nombres") as HTMLInputElement).value,
            "Apellidos" :(document.getElementById("Apellidos") as HTMLInputElement).value,
            "Fecha_nacimiento" : (document.getElementById("Fecha_nacimiento") as HTMLInputElement).value,
            "Condicion_medica" : (document.getElementById("Condicion_medica") as HTMLInputElement).value,
            "Tipo_sangre":(document.getElementById("Tipo_sangre") as HTMLSelectElement).value,
            "Estatura":(document.getElementById("Estatura") as HTMLInputElement).value
        })
    }

}

var datos :Persona[]= [ new Persona({Id:1,Nombres:"Camilo",Apellidos:"Faca",Fecha_nacimiento:"2022-02-08",Condicion_medica:[""],Tipo_sangre:"O+"})] ;
var  tabla :HTMLTableElement  =  document.getElementById("resultado") as HTMLTableElement;
var editar :boolean =false  


function PrintDatos(){

   tabla!.innerHTML="";
    datos.forEach(persona => {
        var tt = document.createElement("tr");
        tt.innerHTML="<td value='"+String(persona.Id)+"'>"+String(persona.Id)+"</td>"
        tt.innerHTML= tt.innerHTML+ "<td  ><p>"+String(persona.Nombres)+"</p></td>"
        tt.innerHTML= tt.innerHTML+"<td><p>"+String(persona.Apellidos)+"</p></td>"
        let ss= ([persona.Fecha_nacimiento.getDay(),persona.Fecha_nacimiento.getMonth()+1,persona.Fecha_nacimiento.getFullYear()]).join("/")
        tt.innerHTML= tt.innerHTML+"<td> <p> "+ss+"<p/> </td>"
        
        tt.innerHTML= tt.innerHTML+"<td><p>"+String(persona.Tipo_sangre )+"</p></td>"
        if (String(persona.Condicion_medica) ===""){
            tt.innerHTML= tt.innerHTML+"<td><p>Ninguna </p></td>"

        }else{
            tt.innerHTML= tt.innerHTML+"<td'><p>"+String(persona.Condicion_medica)+"</p></td>"
        }
        tt.innerHTML= tt.innerHTML+"<td ><p>"+String(persona.Estatura)+"</p></td>"
        tt.innerHTML= tt.innerHTML+ "<td><button  onclick=Delete("+String(persona.Id)+") >Eliminar</button> </td>"
        tt.innerHTML= tt.innerHTML+ "<td><button  onclick=Update("+String(persona.Id)+") >Actualizar</button> </td>"

        tabla.appendChild(tt);
        console.log(persona.toArray());

    });
}

 function GetAlldatos(){
    var http = new XMLHttpRequest();
    var url = 'http://localhost:9001/all_personas';
    http.open('GET', url, false);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            console.log(http.responseText);
            let JSON_RESPONDE= JSON.parse(http.responseText);
            let ddatos:Persona[] = []
             for (const iterator of JSON_RESPONDE) {
                ddatos.push(new Persona(iterator) )
             }
             datos=ddatos
            PrintDatos();
        }

    }
    http.onerror=function(){
        console.log(http.status,http.statusText)
    }
    http.send();
   
    
}


  function Create(datos :Persona){

    var http = new XMLHttpRequest();
    var url = 'http://localhost:9001/all_personas';
    http.open('POST', url, false);
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            alert(http.responseText);
            GetAlldatos();
        }

    }
    
    http.onerror=function(){
        console.log(http.status,http.statusText)
        alert(http.responseText);

    }
    http.send(JSON.stringify(datos));
   
    


}

function Delete (id :number){
    console.log("delete")
    tabla.innerHTML=""
    var http = new XMLHttpRequest();
    var url = 'http://localhost:9001/Delete/'+String(id);
    http.open('DELETE', url, true);
    
    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            alert("datos eleiminados");
            GetAlldatos();
        }

    }
    http.onerror=function(){
        console.log(http.status,http.statusText)
        alert(http.responseText);

    }
    http.send();
   

}

function Get_data (id :number){
    console.log("Get_data")
    tabla.innerHTML=""
    var http = new XMLHttpRequest();
    var url = 'http://localhost:9001/create/'+String(id);
    http.open('GET', url, true);
    
    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            console.log(http.responseText);

            let JSON_RESPONDE= JSON.parse(http.responseText);

            let ddatos:Persona[] = []
             for (const iterator of JSON_RESPONDE) {
                ddatos.push(new Persona(iterator) )
             }
             datos=ddatos
            PrintDatos();
        }

    }
    http.onerror=function(){
        console.log(http.status,http.statusText)
        alert(http.responseText);

    }
    http.send();



}
function Update (id :number){
    console.log("update")
    var http = new XMLHttpRequest();
    var url = 'http://localhost:9001/Update/'+String(id);
    http.open('PATCH', url, false);
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            alert(http.responseText);
            GetAlldatos();
        }

    }
    http.onerror=function(){
        console.log(http.status,http.statusText)
        alert(http.responseText);

    }
    http.send(JSON.stringify(Persona.get_Formulario()));
}


