import { Button } from "@heroui/button";

// todo pull from api
  const genderFilter = [
    { label: "Tất cả", value: "all" },
    { label: "Nữ", value: "female" },
    { label: "Nam", value: "Male" },
    { label: "Bé gái", value: "female-kid" },
    { label: "Bé trai", value: "male-kid" },
  ];


export const BigGenderFilter = () => {
    return (
        <div className="flex gap-4 w-full items-stretch justify-between">
            {genderFilter.map((item) => (
                <Button 
                    key={item.value}
                    variant="bordered" 
                    color="default" 
                    radius="none" 
                    className="w-56" 
                    size="lg"
                >
                    {item.label}
                </Button>
            ))}
      </div>
    )
}