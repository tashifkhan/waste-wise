import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";

export default function CharacterCard({ character }) {
  return (
    <Card
      sx={{
         width: "100vh", // Full width
        height: "10vh", // 1/10 of the height of the container
        background: "rgba(255, 255, 255, 0.1)", // Semi-transparent white
        backdropFilter: "blur(10px)", // Frosted glass effect
        rounde: "lg",
        color: "White",
        margin: "10px",
        borderRadius: "30px",
      }}
    >
      <CardHeader
        avatar={<Avatar src={character?.image} aria-label="recipe"></Avatar>}
        title={character?.name}
        
        subheader={`Status: ${character?.status}`}
      />
    </Card>
  );
}