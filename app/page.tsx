'use client'
import { redirect } from "next/navigation";
import { useState } from "react";


const mockData = [
	{
		id: '1',
		name: 'Dashboard',
		type: 'folder',
		child: [
			{
				id: '1.1',
				name: 'child-1.1',
				type: 'file'
			},
			{
				id: '1.2',
				name: 'child-1.2',
				type: 'folder',
				child: [
					{
						id: '1.2.1',
						name: 'child-1.2.1',
						type: 'file'
					},
					{
						id: '1.2.2',
						name: 'child-1.2.2',
						type: 'file'
					},
				]
			},
			{
				id: '1.3',
				name: 'child-1.3',
				type: 'file'
			},
		]
	},
	{
		id: '2',
		name: 'Dashboard-2',
		type: 'folder',
		child: [
			{
				id: '2.1',
				name: 'child-2.1',
				type: 'file'
			},
			{
				id: '2.2',
				name: 'child-2.2',
				type: 'folder',
				child: [
					{
						id: '2.2.1',
						name: 'child-2.2.1',
						type: 'file'
					},
					{
						id: '2.2.2',
						name: 'child-2.2.2',
						type: 'file'
					},
				]
			},
			{
				id: '2.3',
				name: 'child-2.3',
				type: 'file'
			},
		]
	},
]

// function ChildComponent(props: any) {

// 	const { childData } = props
// 	console.log('childData', childData)

// 	return (
// 		<>
// 			{
// 				childData?.map((data: any, index: any) => (
// 					<div key={index} >
// 						{data.name}
// 						{
// 							data.child?.length > 0 && (
// 								<ChildComponent childData={data.child} />
// 							)
// 						}
// 					</div>
// 				))
// 			}
// 		</>
// 	)
// }


function FolderComponent(props: any) {
	const { data } = props
	const [open, setOpen] = useState(false)
	return (
		<>
			{data.type === 'folder' && (<button onClick={() => setOpen((prev) => !prev)}>
				{open ? 'Close' : 'Open'}
			</button>)}
			{
				open ? (
					<>
						<div>
							{data.name}
							{
								data.child?.length > 0 && (
									data.child.map((child: any, index: any) => (
										<FolderComponent key={index} data={child} />
									))
								)
							}
						</div>
					</>
				) : (
					<>
						<div>
							{data.name}
						</div>
					</>
				)
			}
			{/* {'-----------------------------------------------'} */}
			<br />
		</>
	)
}

export default function Home() {
	redirect("/dashboard");

	// return (
	// 	<div>
	// 		{
	// 			mockData.map((data, index) => (
	// 				<div key={index}>
	// 					<FolderComponent data={data} />
	// 				</div>
	// 			))
	// 		}
	// 	</div>
	// )



}
