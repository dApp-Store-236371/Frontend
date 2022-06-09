interface AppData {
  id: number;
  name: string;
  price: number;
  rating: number;
  description: string;
  img_url: string;
  SHA: string[];
  version: number;
  publication_date: string;
  company: string;
  owned: boolean;
  published: boolean;
  myRating?: number;
  magnetLink?: string;
  category: string
  toastDownloadId?: any
}


export default AppData;
