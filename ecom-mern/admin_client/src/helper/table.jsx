/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Image } from "antd";

const TableDatas = ({ data, heading }) => {
  return (
    <div className="text-black pl-5 w-[78vw] pt-10">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            {heading.map((res, i) => (
              <TableHead key={i}>{res.heading}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, i) => (
            <TableRow key={i}>
              {heading.map((res, j) => (
                <TableCell key={j}>   
                  {res.key === "image" ? (
                    <Image width={80} src={item[res.key]} alt={`Image ${i}`} />
                  ) : (
                    item[res.key]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableDatas;
