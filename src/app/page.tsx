'use client';
import Image from 'next/image';
import {useState} from 'react';

import {generateAltText} from '@/ai/flows/generate-alt-text';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';

const DUMMY_IMAGES = [
  {id: '1', src: 'https://picsum.photos/id/10/400/300', alt: 'A scenic landscape'},
  {id: '2', src: 'https://picsum.photos/id/20/400/300', alt: 'An abstract painting'},
  {id: '3', src: 'https://picsum.photos/id/30/400/300', alt: 'A portrait of a person'},
  {id: '4', src: 'https://picsum.photos/id/40/400/300', alt: 'A cityscape at night'},
  {id: '5', src: 'https://picsum.photos/id/50/400/300', alt: 'A close-up of a flower'},
  {id: '6', src: 'https://picsum.photos/id/60/400/300', alt: 'A group of animals in the wild'},
];

export default function Home() {
  const [images, setImages] = useState(DUMMY_IMAGES);
  const [sortOrder, setSortOrder] = useState('default');
  const [filterTerm, setFilterTerm] = useState('');

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    // Implement sorting logic based on 'value'
    if (value === 'name') {
      setImages([...images].sort((a, b) => a.alt.localeCompare(b.alt)));
    } else if (value === 'date') {
      // Assuming you have a date field, otherwise, implement your logic
      // setImages([...images].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      alert('Sort by date not implemented yet');
    } else {
      setImages(DUMMY_IMAGES); // Reset to default order
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterTerm(event.target.value);
    // Implement filtering logic based on 'event.target.value'
    if (event.target.value) {
      setImages(DUMMY_IMAGES.filter(img => img.alt.toLowerCase().includes(event.target.value.toLowerCase())));
    } else {
      setImages(DUMMY_IMAGES);
    }
  };

  const handleMissingAltText = async (id: string, imageUrl: string) => {
    // Generate alt text using AI
    const altTextResult = await generateAltText({imageUrl: imageUrl});
    // Update the image in the array with the new alt text
    const updatedImages = images.map(img => {
      if (img.id === id) {
        return {...img, alt: altTextResult.altText};
      }
      return img;
    });
    setImages(updatedImages);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Aesthetica Gallery</CardTitle>
          <CardDescription>A beautiful gallery app</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Select onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="date">Upload Date</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="Filter by name..."
              value={filterTerm}
              onChange={handleFilterChange}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map(image => (
              <div key={image.id}>
                <Image
                  src={image.src}
                  alt={image.alt || 'No alt text'}
                  width={400}
                  height={300}
                  className="rounded-md shadow-md"
                />
                {!image.alt && (
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Missing alt text</p>
                    <Button
                      size="sm"
                      onClick={() => handleMissingAltText(image.id, image.src)}
                    >
                      Generate Alt Text
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


    