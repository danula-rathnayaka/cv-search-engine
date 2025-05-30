import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

const CvCard = ({ cv }: any) => {
  return (
    <Card className="w-[300px] bg-neutral-800 text-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{cv.full_name}</CardTitle>
        <CardDescription className="text-sm">
          {cv.current_title} at {cv.current_employer}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-sm">
          <strong>Email:</strong> {cv.contact_info.email}
        </div>
        <div className="text-sm">
          <strong>Phone:</strong> {cv.contact_info.phone}
        </div>
        <div className="text-sm">
          <strong>Location:</strong> {cv.contact_info.location}
        </div>
        <div className="text-sm">
          <strong>Experience:</strong> {cv.years_of_experience} years
        </div>
        <div className="text-sm">
          <strong>Availability:</strong> {cv.availability}
        </div>
        <div className="text-sm">
          <strong>Remote/Relocation:</strong> {cv.remote_or_relocation}
        </div>
      </CardContent>

      <CardFooter>
        <Button>View Details</Button>
      </CardFooter>
    </Card>
  );
};

export default CvCard;
