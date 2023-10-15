<template>
	<div class="scs_wrapper">
		<div class="scs">
			<div class="sc">
				<div class="sc_body">
					<div class="sc_edit">
						<img src="./assets/edit.svg">
					</div>
				</div>
				<div class="sc_name">Google</div>
			</div>
		</div>
	</div>
</template>


<script setup>
</script>

<style lang="scss">
	@use "./scss/Default";
	.scs_wrapper {
		background-color: transparent;
		width: 100%;
		display: flex;
		justify-content: center;

		.scs {
			background-color: transparent;
			width: max-content;
			max-width: 90vw;
			gap: 10px;
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
			justify-items: center;
			margin-top: 20px;
			margin-bottom: 20px;

			.sc{
				width: 200px;
				height: fit-content;
				display: flex;
				flex-flow: column;
				align-items: center;
				gap: 5px;
				border-radius: 12px;
				padding: 8px;
				box-sizing: border-box;
				&:hover{
					background-color: rgba(0, 0, 0, 0.2);
					cursor: pointer;
				}
				&:hover>.sc_body>.sc_edit{
					visibility: visible;
				}

				.sc_body{
					aspect-ratio: 16/9;
					width: 100%;
					background-color: rgb(179, 179, 255);
					border-radius: 10px;
					display: flex;
					flex-flow: column;
					padding: 5px;
					box-sizing: border-box;
				
					.sc_edit{
						aspect-ratio: 1/1;
						width: 30px;
						border-radius: 50px;
						background-color: rgba(0, 0, 0, 0.3);
						display: flex;
						justify-content: center;
						align-items: center;
						box-sizing: border-box;
						padding: 5px;
						opacity: 0.4;
						align-self: flex-end;
						visibility: hidden;
				
						&:hover{
							opacity: 0.8;
						}
				
						img{
							aspect-ratio: 1/1;
							max-width: 100%;
						}
					}
				}
				
				.sc_name{
					color: #FFFFFF;
					font-family: Arial, Helvetica, sans-serif;
					font-weight: 200;
					text-shadow:
					-1px -1px 0 #000,
					0   -1px 0 #000,
					1px -1px 0 #000,
					1px  0   0 #000,
					1px  1px 0 #000,
					0    1px 0 #000,
					-1px  1px 0 #000,
					-1px  0   0 #000;
				}
			}
		}
	}






</style>