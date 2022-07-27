package main

import (
  "fmt"
  "math/rand"
)

func transpose(transposeArray [][]float64 ) [][] float64 {

  var array [][]float64

  for index := range transposeArray[0] {
    var row []float64

    for _, transposeRow := range transposeArray {
      row = append(row, transposeRow[index])
    }
    array = append(array, row)
  }

  return array
}

func random() float64 {
  return rand.Float64() * 2 - 1
}

func random2d(rows int, columns int) [][]float64 {

  array := make([][]float64, rows)

  for i := 0; i < rows; i++ {
    row := make([]float64, columns)
    for j := 0; j < columns; j++ {
      row[j] = random()
    }
    array[i] = row
  }

  return array
}




func main() {

  fmt.Println("Hello world!")

  array := random2d(5, 2)

  fmt.Println(array)

  fmt.Println(transpose(array))

}