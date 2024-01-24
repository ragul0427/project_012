/* eslint-disable no-unused-vars */
import TableDatas from '@/helper/table'
import React from 'react'

const Category = () => {

  const Header = [
    { heading: "Name", key: "name" },
    { heading: "Category Name", key: "categoryName" },
    { heading: "Price", key: "price" },
    { heading: "Status", key: "status" },
    { heading: "Availability", key: "availability" },
    { heading: "Total", key: "total" },
  ];
  
  const Datas=[
    {
      id:1,
      name:"mobile",
      categoryName:"mobile",
      price:999,
      status:"available",
      availability:"available",
      total:10000
    },
    {
      id:2,
      name:"Lg Tv",
      categoryName:"Tv",
      price:29999,
      status:"available",
      availability:"available",
      total:89999
    },
  ]

  return (
    <div className='text-green-500 pl-5'>
      <TableDatas data={Datas} heading={Header}/>
    </div>
  )
}

export default Category