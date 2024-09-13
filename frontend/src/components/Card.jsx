import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

export default function CharacterCard({ character }) {
  return (
    <Card
      sx={{
        width: "75vw",           // 50% of the viewport width
        height: "70vh",          // 33% of the viewport height
        background: "black",
        color: "white",
        margin: "20px",          // Add margin to create space between cards
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Character Image */}
      <CardMedia
        component="img"
        image={character?.image}
        alt={character?.name}
        sx={{ height: "75%", objectFit: "cover" }}  
      />

      {/* Character Name and Species */}
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h6" sx={{ color: "white" }}>
          {character?.name}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "gray" }}>
          Species: {character?.species}
        </Typography>
      </CardContent>
    </Card>
  );
}
