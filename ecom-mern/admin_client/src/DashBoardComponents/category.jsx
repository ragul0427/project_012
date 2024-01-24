/* eslint-disable no-unused-vars */
import TableDatas from "@/helper/table";
import { Switch, Modal, Upload, notification } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  EditOutlined,
  FileAddOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/firebase/firebaseconfig";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { get, isEmpty } from "lodash";
import {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../api/apihelper";
import { DeleteOutline } from "@mui/icons-material";
import { v4 } from "uuid";
import { io } from "socket.io-client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";

const FormSchema = z.object({
  categoryName: z.string(),
  from: z.string(),
  categoryId:z.string(),
  
});

const FormSchema2 = z.object({
  name: z
    .string()
    .refine((value) => value !== undefined && value !== null && value !== "", {
      message: "name is required",
    }),
});

const Category = () => {
  const [open, setOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [data, setData] = useState([]);
  const [updateId, setUpdateId] = useState("");
  const [updateHeadingId, setUpdateHeadingId] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [image, setImage] = useState([]);
  const [loadingButton, setLoadingButton] = useState(false);
  const [categoryHeading, setCategoryHeading] = useState([]);
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      from:"",
      categoryId:"",
      image:""
    },
  });

  const form2 = useForm({
    resolver: zodResolver(FormSchema2),
    defaultValues: {
      name: "",
    },
  });
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io("http://localhost:8080"));
  }, []);

  const fetchData = async () => {
    try {
      const result = await getCategory();
      console.log(result, "res");
      setData(get(result, "data.data.category", []));
      setCategoryHeading(get(result, "data.data.categoryHeading", []));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("send-data-from-server", (data) => {
      console.log(data, "dayaduaguadsy");
    });
  }, [socket]);

  const handleEdit = async (values) => {
    setUpdateId(values._id);
    console.log(values, "val");
    setOpen(!open);
    form.reset(values);
    setFileList([
      { uid: "-1", name: "existing_image", status: "done", url: values.image },
    ]);
    setImageUrl(values.image);
  };

  const Header = [
    { heading: "Name", key: "categoryName" },
    { heading: "Category Image", key: "image" },
    { heading: "From Price", key: "from" },
    { heading: "Edit", key: "edit" },
    { heading: "Delete", key: "delete" },
  ];

  const table2 = [
    { heading: "Name", key: "name" },
    { heading: "Edit", key: "edit" },
    { heading: "Delete", key: "delete" },
  ];

  const Data2 = categoryHeading.map((item) => ({
    name: item.name,
    edit: (
      <EditOutlined
        className="!cursor-pointer"
        onClick={() => handleEditHeading(item)}
      />
    ),
    delete: <DeleteOutline className="!cursor-pointer" />,
  }));

  const handleEditHeading = (val) => {
    setUpdateHeadingId(val._id);
    form2.reset(val);
  };

  const Data = data.map((item, i) => ({
    categoryName: item.categoryName,
    image: item.image,
    from: item.from,
    edit: (
      <EditOutlined
        className="!cursor-pointer"
        onClick={() => handleEdit(item)}
      />
    ),
    delete: (
      <DeleteOutline
        className="!cursor-pointer"
        onClick={() => handleDelete(item)}
      />
    ),
  }));

  const handleDelete = async (item) => {
    try {
      const formData = {
        id: item._id,
      };
      await deleteCategory(formData);
      const fileName = item.image?.split("?")[0].split("%2F")[1];
      const decodedString = decodeURIComponent(fileName);
      await deleteObject(ref(storage, `category-images/${decodedString}`));
      fetchData();
      notification.success({ message: "Category deleted successfully" });
    } catch (e) {
      console.log(e);
    }
  };

  const onSubmit = async (val) => {
    console.log(val,"values")
    // setLoadingButton(true);
    if (isEmpty(image) && !updateId) {
      notification.error({ message: "Upload Image" });
      return;
    }
    // if (!textHeading) {
    //   setError("required");
    //   return;
    // }
    try {
      let downloadUrl = imageUrl;

      if (!isEmpty(image)) {
        const imageRef = ref(
          storage,
          `category-images/${v4()}${image[0]?.name}`
        );
        const snapshot = await uploadBytes(imageRef, image[0]?.originFileObj);
        downloadUrl = await getDownloadURL(snapshot.ref);

        if (updateId && imageUrl) {
          const fileName = imageUrl?.split("?")[0].split("%2F")[1];
          const decodedString = decodeURIComponent(fileName);
          await deleteObject(ref(storage, `category-images/${decodedString}`));
        }
      }

      if (downloadUrl) {
        const formData = {
          categoryName: get(val, "categoryName", ""),
          image: downloadUrl,
          from: get(val, "from", ""),
          userId: "37189728917298172",
          _id: updateId || null,
          categoryId:get(val, "categoryId", ""),
        };

        await (updateId ? updateCategory(formData) : createCategory(formData));

        socket.emit("send-data", { data: formData });

        setOpen(!open);
        setFileList([]);
        form.reset({ categoryName: "", from: "",categoryId:"",image:"" });
        setUpdateId("");
        setImage([]);
        setImageUrl("");
        fetchData();

        const message = updateId
          ? "Category updated successfully"
          : "Category created successfully";

        notification.success({ message });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingButton(false);
    }
  };

  const onUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setImage(newFileList);
    form.setValue("image", newFileList);
  };

  const onSubmitHeading = async (values) => {
    setLoadingButton(true);
    console.log(values,"values")
    try {
      const formData = {
        name: values.name,
        _id: updateHeadingId,
      };

      await (updateHeadingId
        ? updateCategory(formData)
        : createCategory(values));
      form2.reset({ name: "" });
      const message = updateHeadingId
        ? "Category updated successfully"
        : "Category created successfully";

      fetchData();

      notification.success({ message });
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingButton(false);
    }
  };

  return (
    <div className="text-green-500 pl-[20vw]  pt-10">
      <Form {...form2}>
        <form
          onSubmit={form2.handleSubmit(onSubmitHeading)}
          className="flex justify-between px-20"
        >
          <FormField
            control={form2.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Add category heading name..."
                    {...field}
                    className="!w-[60vw]"
                  />
                </FormControl>
                {/* 
                <FormMessage className="text-red-500 font-normal !mt-[-1px] pl-1">
                  {form2.formState.errors?.name?.message}
                </FormMessage> */}
              </FormItem>
            )}
          />

          <div className="flex gap-3 !text-white items-end justify-end">
            <Button
              type="submit"
              className="!bg-green-500 !rounded-[6px] !h-[35px]"
              disabled={loadingButton}
            >
              {loadingButton
                ? "Loading..."
                : updateHeadingId
                ? "Update"
                : "Add"}
            </Button>
          </div>
        </form>
      </Form>
      <TableDatas data={Data2} heading={table2} className="!mt-20" />

      <div className="!mt-20">
      <Drawer open={open}>
        <DrawerTrigger asChild >
        <div
          className="float-right pr-20 cursor-pointer"
          onClick={()=>{setOpen(!open)}}
        >
          <FileAddOutlined />
        </div>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Add Categories</DrawerTitle>
            
            </DrawerHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="categoryName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter category name..."
                          className="!text-black"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage className="text-red-500 font-normal !mt-[-1px] pl-1">
                        {form.formState.errors?.name?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Price</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter category from price..."
                          {...field}
                          className="!text-black"
                          
                        />
                      </FormControl>

                      <FormMessage className="text-red-500 font-normal !mt-[-1px] pl-1">
                        {form.formState.errors?.name?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Category Heading</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a verified email to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryHeading.map((res, i) => {
                            return (
                              <SelectItem value={res._id} key={i} >
                                {res.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      {form.formState.errors?.name?.message}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Image</FormLabel>
                      <FormControl>
                        <Upload
                          onChange={onUploadChange}
                          fileList={fileList}
                          onPreview={(e) => {}}
                          maxCount={1}
                          listType="picture-card"
                          multiple={false}
                        >
                          <div className="text-white">
                            <UploadOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                          </div>
                        </Upload> 
                         {/* <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Label htmlFor="picture">Picture</Label>
                          <Input
                            id="picture"
                            type="file"
                            className="file:bg-white file:hover:cursor-pointer file:text-blue-700 bg-white text-black hover:file:bg-blue-100 file:border file:border-solid file:border-blue-700 file:rounded-md border-blue-600"
                            {...field}
                            
                          />
                        </div> */}
                      </FormControl>
                      {form.formState.errors?.name?.message}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 !text-white items-end justify-end">
                  <Button
                    onClick={() => {
                      setOpen(!open);
                      setFileList([]);
                      setUpdateId("");
                      form.reset({ name: "", from: "" });
                    }}
                   
                    className="!bg-red-500 !rounded-[6px] !h-[35px]"
                    
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="!bg-green-500 !rounded-[6px] !h-[35px]"
                    disabled={loadingButton}
                  >
                    {loadingButton
                      ? "Loading..."
                      : updateId
                      ? "Update"
                      : "Submit"}
                  </Button>
                </div>
              </form>
            </Form>
            <DrawerFooter></DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
        <TableDatas data={Data} heading={Header} className="!mt-20" />
      </div>
  
      {/* <Modal
        open={open}
        footer={false}
        onCancel={() => {
          setOpen(!open);
          setFileList([]);
          setUpdateId("");
          form.reset({ name: "", from: "" });
        }}
      >
      
      </Modal> */}
    </div>
  );
};

export default Category;
