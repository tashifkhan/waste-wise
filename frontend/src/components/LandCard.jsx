import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";

export default function CharacterCard({ character }) {
	return (
		<Card
			sx={{
				width: "80vw", // Adjust width based on screen size
				height: "10vh", // 1/10 of the height of the container
				background: "rgba(255, 255, 255, 0.1)", // Semi-transparent white
				backdropFilter: "blur(10px)", // Frosted glass effect
				color: "white",
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
