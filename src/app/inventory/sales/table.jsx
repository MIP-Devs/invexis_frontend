import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";


const rows = [
  {
    id: 1,
    ProductName: "John Doe theBadman",
    Category: 24,
    UnitPrice: 100,
    InStock: 10,
    Discount: "20%",
    Date: "12/09/2024",
    TotalValue: 40,
    action:"more"
  },
  {
    id: 2,
    ProductName: "John Doe theBadman",
    Category: 24,
    UnitPrice: 100,
    InStock: 10,
    Discount: "20%",
    Date: "12/09/2024",
    TotalValue: 40,
    action:"more"
  },
  {
    id: 3,
    ProductName: "John Doe theBadman",
    Category: 24,
    UnitPrice: 100,
    InStock: 10,
    Discount: "20%",
    Date: "12/09/2024",
    TotalValue: 40,
    action:"more"
  },
    {
    id: 4,
    ProductName: "John Doe theBadman",
    Category: 24,
    UnitPrice: 100,
    InStock: 10,
    Discount: "20%",
    Date: "12/09/2024",
    TotalValue: 40,
    action:"more"
  },
  {
    id: 5,
    ProductName: "John Doe theBadman",
    Category: 24,
    UnitPrice: 100,
    InStock: 10,
    Discount: "20%",
    Date: "12/09/2024",
    TotalValue: 40,
    action:"more"
  },
  {
    id: 6,
    ProductName: "John Doe theBadman",
    Category: 24,
    UnitPrice: 100,
    InStock: 10,
    Discount: "20%",
    Date: "12/09/2024",
    TotalValue: 40,
    action:"more"
  },

  {
    id: 7,
    ProductName: "John Doe theBadman",
    Category: 24,
    UnitPrice: 100,
    InStock: 10,
    Discount: "20%",
    Date: "12/09/2024",
    TotalValue: 40,
    action:"more"
  },
  {
    id: 8,
    ProductName: "John Doe theBadman",
    Category: 24,
    UnitPrice: 100,
    InStock: 10,
    Discount: "20%",
    Date: "12/09/2024",
    TotalValue: 40,
    action:"more"
  },
  {
    id: 9,
    ProductName: "John Doe theBadman",
    Category: 24,
    UnitPrice: 100,
    InStock: 10,
    Discount: "20%",
    Date: "12/09/2024",
    TotalValue: 40,
    action:"more"
  },
    {
    id: 10,
    ProductName: "John Doe theBadman",
    Category: 24,
    UnitPrice: 100,
    InStock: 10,
    Discount: "20%",
    Date: "12/09/2024",
    TotalValue: 40,
    action:"more"
  },
  {
    id: 11,
    ProductName: "John Doe theBadman",
    Category: 24,
    UnitPrice: 100,
    InStock: 10,
    Discount: "20%",
    Date: "12/09/2024",
    TotalValue: 40,
    action:"more"
  },
  {
    id: 12,
    ProductName: "John Doe theBadman",
    Category: 24,
    UnitPrice: 100,
    InStock: 10,
    Discount: "20%",
    Date: "12/09/2024",
    TotalValue: 40,
    action:"more"
  },
  
  
];

const columns = [
  { field: "id", headerName: "Sale", width: 70 },
  { field: "ProductName", headerName: "Product Name", width: 130 },
  { field: "Category", headerName: "Category", width: 90 },
  { field: "UnitPrice", headerName: "Unit Price (FRW)", width: 200 },
  { field: "InStock", headerName: "In Stock", width: 160 },
  { field: "Discount", headerName: "Discount", width: 120 },
  { field: "Date", headerName: "Date", width: 120 },
  { field: "TotalValue", headerName: "Total Value", width: 120 },
  { field: "action", headerName: "View", width: 10 },
];



const DataTable = () =>{

    const navigation = useRouter()
    return(<>
       <DataGrid
                  rows={rows}
                  columns={columns}
                  hideFooter={true}
                  autoPageSize={false}
                  disableColumnResize
                  disableRowSelectionOnClick
                  onRowClick={(params)=>{
                  navigation.push(`/inventory/sales/${params.id}`)
                  }}
                  rowHeight={40}
                    sx={{
                         "& .MuiDataGrid-columnHeaders": {
                         backgroundColor: "#1976d2",
                         color: "gray",
                         fontSize: 16,
                         fontWeight: "extrabold",
                       },
                       "& .MuiDataGrid-row:hover": {
                         backgroundColor: "#f5f5f5",
                         color:"black"
                       },
                       "& .MuiDataGrid-cell": {
                         borderBottom: "1px solid #ddd",
                       },
                     }}
                />
    
    
    </>)
}

export default DataTable