package main

import (
	S "laboratorio4/Servidor"
	"net/http"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}

}
func main() {

	Server := gin.Default()
	Server.Use(cors.Default())
	Server.GET("/all_personas", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, S.Getall())
	})
	Server.GET("/Read/:id", func(ctx *gin.Context) {

		id, err := strconv.Atoi(ctx.Param("id"))
		if err != nil {
			ctx.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
			return
		}
		s, err2 := S.GET(id)
		if err2 != nil {
			ctx.JSON(http.StatusBadRequest, map[string]string{"error": err2.Error()})
			return
		}

		ctx.JSON(http.StatusOK, s)
	})
	Server.POST("/Create", func(ctx *gin.Context) {

		var P S.Persona
		obj_error := ctx.ShouldBindJSON(&P)
		if obj_error != nil {
			ctx.JSON(http.StatusBadRequest, map[string]string{"error": "error en la creacion de los datos"})
		}
		err2, new_id := S.Crear(P)
		if err2 != nil {
			ctx.JSON(http.StatusBadRequest, map[string]string{"error": err2.Error()})
			return
		}
		ctx.JSON(http.StatusOK, map[string]int{"id_nueva": new_id})

	})
	Server.PATCH("/Update/:id", func(ctx *gin.Context) {
		id, err := strconv.Atoi(ctx.Param("id"))
		if err != nil {
			ctx.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
			return
		}
		var P S.Persona
		ctx.ShouldBindJSON(&P)

		err2, new_id := S.Actualizar(id, P)
		if err2 != nil {
			ctx.JSON(http.StatusBadRequest, map[string]string{"error": err2.Error()})
			return
		}
		ctx.JSON(http.StatusOK, map[string]int{"id_nueva": new_id})
	})
	Server.DELETE("/Delete/:id", func(ctx *gin.Context) {
		id, err := strconv.Atoi(ctx.Param("id"))
		if err != nil {
			ctx.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
			return
		}
		err2 := S.Delete(id)
		if err2 != nil {
			ctx.JSON(http.StatusBadRequest, map[string]string{"error": err2.Error()})
			return
		}
		ctx.JSON(http.StatusOK, nil)
	})
	Server.Run(":9001")
	for {
	}
}
