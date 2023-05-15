package Servidor

import (
	"errors"
	"time"
)

type Sangre string

const (
	OPositivo  Sangre = "O+"
	ONegativo  Sangre = "O-"
	APositivo  Sangre = "A+"
	ANegativo  Sangre = "A-"
	ABNegativo Sangre = "AB+"
	ABPositivo Sangre = "AB-"
	BNegativo  Sangre = "B-"
	BPositivo  Sangre = "B+"
	SangreOro  Sangre = " "
)

type Persona struct {
	Id               int       `json:"Id"`
	Nombre           string    `json:"Nombres"`
	Apellido         string    `json:"Apellidos"`
	Fecha_nacimiento time.Time `json:"Fecha_nacimiento"`
	Tipo_sangre      Sangre    `json:"Tipo_sangre"`
	Condicion_medica string    `json:"Condicion_medica"`
	Estatura         float32   `json:"Estatura"` // en metros
}

var Personas []Persona = []Persona{

	Persona{Id: 1, Nombre: "Daniel", Apellido: "A", Fecha_nacimiento: time.Now(), Condicion_medica: "",
		Tipo_sangre: OPositivo, Estatura: 1.30},
}

func Crear(P Persona) (error, int) {
	for i := 0; i < len(Personas); i++ {
		Personas[i].Id = i + 1
	}

	for i := 0; i < len(Personas); i++ {
		if P.Nombre == Personas[i].Nombre && P.Apellido == Personas[i].Apellido {
			return errors.New("Nombre y apellido ya existen "), -1
		}
	}

	Personas = append(Personas, P)
	Personas[len(Personas)-1].Id = len(Personas)
	return nil, len(Personas)
}
func Actualizar(id int, P Persona) (error, int) {

	var s = 0

	for i := 0; i < len(Personas); i++ {
		if Personas[i].Id == id {
			Personas[i] = P
			s = i + 1
			break
		}
		Personas[i].Id = i + 1
	}
	return nil, s
}

func Delete(id int) error {
	if len(Personas) == 0 {
		return errors.New("No existen registros")
	} else if id <= 0 || id > len(Personas) {
		return errors.New("No existe este registro")
	} else if id == 1 && len(Personas) == 1 {
		Personas = []Persona{}
		return nil
	} else if id == len(Personas) {
		Personas = append(Personas[:len(Personas)-1])
		return nil
	} else if id == 1 {
		Personas = Personas[1:]
	} else {
		Personas = append(Personas[0:id-1], Personas[id+1:]...)
	}

	for i := 0; i < len(Personas); i++ {
		Personas[i].Id = i + 1
	}
	return nil
}

func GET(id int) (Persona, error) {
	if len(Personas) == 0 {
		return Persona{}, errors.New("No existen registros")
	} else if id <= 0 || id > len(Personas) {
		return Persona{}, errors.New("No existe este registro")
	}

	return Personas[id-1], nil

}
func Getall() []Persona {
	return Personas
}
