import React from 'react';
import { Bell, Home, AlertTriangle, Info } from 'lucide-react';

const AdjacentParcelsTab: React.FC = () => {
  const parcelsData = [
    { chiban: '宇田川町83-1', area: 245.32, owner: '株式会社田中商事', landType: '宅地', isChanged: false },
    { chiban: '宇田川町83-2', area: 312.45, owner: 'WHERE不動産株式会社', landType: '宅地', isChanged: false },
    { chiban: '宇田川町83-3', area: 198.67, owner: '山田太郎', landType: '宅地', isChanged: false },
    { chiban: '宇田川町83-4', area: 278.90, owner: '株式会社ABC開発', landType: '宅地', isChanged: true, previousOwner: '佐藤花子', changeDate: '2025-08-15' },
    { chiban: '宇田川町83-5', area: 156.23, owner: '鈴木次郎', landType: '宅地', isChanged: false },
    { chiban: '宇田川町83-6', area: 423.56, owner: '合同会社みどり', landType: '宅地', isChanged: false },
    { chiban: '宇田川町83-7', area: 189.45, owner: '高橋建設株式会社', landType: '宅地', isChanged: false },
    { chiban: '宇田川町83-8', area: 267.89, owner: '伊藤商店', landType: '店舗', isChanged: false },
    { chiban: '宇田川町83-9', area: 345.12, owner: '株式会社富士不動産', landType: '宅地', isChanged: false },
    { chiban: '宇田川町83-10', area: 201.34, owner: '渡辺一郎', landType: '宅地', isChanged: false },
    { chiban: '宇田川町83-11', area: 178.56, owner: '中村産業株式会社', landType: '宅地', isChanged: false },
    { chiban: '宇田川町83-12', area: 298.78, owner: '加藤美智子', landType: '宅地', isChanged: false },
    { chiban: '宇田川町83-13', area: 412.90, owner: 'オリックス不動産投資法人', landType: '事務所', isChanged: false },
    { chiban: '宇田川町83-14', area: 223.45, owner: '小林三郎', landType: '宅地', isChanged: false },
    { chiban: '宇田川町83-15', area: 367.23, owner: '東京建物株式会社', landType: '宅地', isChanged: false },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">隣地地番一覧</h3>
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600">1件の所有者変更を検知</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">宇田川町83番地周辺の土地登記情報</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  地番
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  地積（㎡）
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  所有者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  地目
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {parcelsData.map((parcel, index) => (
                <tr key={index} className={`${parcel.isChanged ? 'bg-yellow-50' : ''} ${parcel.chiban === '宇田川町83-2' ? 'bg-blue-50' : ''} hover:bg-gray-50`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {parcel.chiban === '宇田川町83-2' && (
                        <Home className="w-4 h-4 text-blue-600 mr-2" />
                      )}
                      <span className={`text-sm ${parcel.chiban === '宇田川町83-2' ? 'font-semibold text-blue-900' : 'font-medium text-gray-900'}`}>
                        {parcel.chiban}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{parcel.area.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{parcel.owner}</div>
                      {parcel.isChanged && (
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="text-red-600">変更前: {parcel.previousOwner}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{parcel.landType}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {parcel.isChanged ? (
                      <div className="flex items-center">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-xs font-medium text-yellow-700">
                          所有者変更 ({parcel.changeDate})
                        </span>
                      </div>
                    ) : parcel.chiban === '宇田川町83-2' ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        対象地
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">変更なし</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p>登記情報は2025年9月3日時点のデータです。</p>
              <p className="mt-1">
                <span className="font-medium text-yellow-700">宇田川町83-4</span>
                の所有者が変更されました。詳細な変更内容は法務局で確認が必要です。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdjacentParcelsTab;