import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";


const data = [
  { name: "LapTops", value: 800 },
  { name: "Phones", value: 300 },
];

const COLORS = ["#0088FE", "orange",];




const TopCards = ({jostFont}) =>{
    return(
        <>
        <section className={`${jostFont.className} w-full  grid md:grid-cols-4 lg:grid-cols-4 sm:grid-cols-1 gap-3`}>
          <div className="border-3 border-gray-200 rounded-2xl p-4 space-y-5">
                <h1 className="font-bold text-md">Sold Product Today</h1>
                <p className="font-black text-3xl text-gray-600">400 <span className="text-amber-600">Pcs</span> </p>
                <h1 className="text-md">Today you have sold <span className="p-2 bg-green-200 text-green-600 rounded-full">10%</span> </h1>
          </div>

           <div className="border-3 border-gray-200 rounded-2xl p-4 space-y-5">
                <h1 className="font-bold text-md">Current Revenue Today </h1>
                <p className="font-black text-3xl text-gray-600">5,000,000 </p>
                <h1 className="text-md"><span className="text-green-400 rounded-full">400 X 500</span> </h1>
          </div>

           <div className="border-3 border-gray-200 rounded-2xl p-4 space-y-1">
                <h1 className="font-bold text-md">Low stock Items</h1>
            <div>
                  <div>
                        <PieChart width={100} height={100}>
                  <Pie
                  data={data}
                  innerRadius={40}
                  outerRadius={50}
                  fill="#8884d8"
                  paddingAngle={10}
                  dataKey="value"
                  >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  </Pie>
                  <Tooltip />
                  </PieChart>    
                  </div>
                  <div>
                         <Legend />
                  </div>
            </div> 
          </div>

           <div className="border-3 border-gray-200 rounded-2xl p-4 space-y-5">
                <h1 className="font-bold text-md">Expected income on stock </h1>
                <p className="font-black text-3xl text-gray-600">120,000,000</p>
                <h1 className="text-md"><span className="text-green-400 rounded-full">When we empty our stock</span> </h1>
          </div>
        
        </section>
        </>
    )
}

export default TopCards
