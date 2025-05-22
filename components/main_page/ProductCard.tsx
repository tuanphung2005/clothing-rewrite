import { Card, CardBody, CardFooter } from "@heroui/card";
import { ProductImageSlider } from "@/components/ProductImageSlider";
import { FormatCurrency } from "@/models/FormatCurrency";

export const ProductCard = () => {

      // products data TODO: get from API
      const products = [
        {
          id: 1,
          name: "clothing 1",
          image: [
            "https://placehold.co/250x400/",
            "https://placehold.co/250x400/",
            "https://placehold.co/250x400/"
          ],
          colors: ["red", "green"],
          price: 100000,
          salePrice: 50000,
          sizes: ["S", "M", "L"],
          type: "shirt"
        },
        {
          id: 2,
          name: "clothing 2",
          image: [
            "https://placehold.co/250x400/",
            "https://placehold.co/250x400/",
            "https://placehold.co/250x400/"
          ],
          colors: ["blue", "yellow"],
          price: 200000,
          salePrice: 150000,
          sizes: ["M", "L", "XL"],
          type: "pants"
        },
        {
          id: 3,
          name: "clothing 3",
          image: [
            "https://placehold.co/250x400/",
            "https://placehold.co/250x400/",
            "https://placehold.co/250x400/"
          ],
          colors: ["black", "white"],
          price: 300000,
          salePrice: 250000,
          sizes: ["L", "XL", "XXL"],
          type: "unders"
        }
      ]
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-7xl">
          {products.map((product) => (
            <Card key={product.id} isPressable radius="none" shadow="none">
              <CardBody className="p-0">
                <ProductImageSlider 
                  images={product.image} 
                  alt={product.name} 
                />
              </CardBody>

              <CardFooter className="flex flex-col items-start justify-start">
                <div className="flex gap-1">
                  {product.colors.map((color) => (
                    <div 
                      key={color} 
                      className="w-6 h-6 rounded-full" 
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-1 items-start justify-start">
                  <p className="text-base font-light">{product.name}</p>
                  <p className="text-base text-gray-500 font-bold">{FormatCurrency(product.salePrice)}</p>
                  <div className="flex flex-row gap-2">
                    <p className="text-base text-gray-500 line-through">{FormatCurrency(product.price)}</p>
                    <p className="text-red-600 font-semibold">
                      -{Math.round((1 - product.salePrice / product.price) * 100)}%
                    </p>
                  </div>  
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
    )
}